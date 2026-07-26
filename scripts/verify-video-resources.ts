import fs from 'fs';
import path from 'path';
import { ALL_MODULES } from '../src/data/curriculumData';
import { COMPUTER_SCIENCE_COURSES } from '../src/curriculum/programs/computerScience';
import { DATA_SCIENCE_COURSES } from '../src/curriculum/programs/dataScience';
import { parseYouTubeResource, isNormalWebPage } from '../src/utils/embedUtils';
import { VideoVerificationStatus, VerifiedVideoResource } from '../src/types/resources';

interface VideoAuditEntry {
  id: string;
  source: string;
  topicId: string;
  title: string;
  institution: string;
  videoId?: string;
  playlistId?: string;
  rawUrl: string;
  embedUrl: string;
  canonicalUrl: string;
  status: VideoVerificationStatus;
  embeddable: boolean;
  issues: string[];
  fallbackCount: number;
  lastVerifiedAt: string;
}

async function verifyYouTubeOembed(videoId: string): Promise<{ ok: boolean; status: number; title?: string; author?: string }> {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}&format=json`;
    const res = await fetch(oembedUrl);
    if (res.status === 200) {
      const data = await res.json();
      return { ok: true, status: 200, title: data.title, author: data.author_name };
    }
    return { ok: false, status: res.status };
  } catch (e: any) {
    return { ok: false, status: 500 };
  }
}

async function runVideoVerificationPipeline() {
  const args = process.argv.slice(2);
  const isReportOnly = args.includes('--report');
  const isChangedOnly = args.includes('--changed');

  console.log('================================================================');
  console.log('  COMPUTERFY - COMPREHENSIVE VIDEO AVAILABILITY AUDIT & VERIFIER');
  console.log('================================================================\n');

  const entries: VideoAuditEntry[] = [];
  const addVideo = (v: any, source: string, topicId: string) => {
    if (!v) return;
    const rawUrl = v.url || v.embedUrl || v.canonicalUrl || '';
    const { videoId, playlistId } = parseYouTubeResource(rawUrl || v.videoId || '');
    const cleanVideoId = videoId || v.videoId || '';
    
    entries.push({
      id: v.id || `video-${topicId}`,
      source,
      topicId,
      title: v.title || 'Untitled Lecture',
      institution: v.provider || v.institution || 'University Source',
      videoId: cleanVideoId,
      playlistId: playlistId || v.playlistId,
      rawUrl,
      embedUrl: v.embedUrl || (cleanVideoId ? `https://www.youtube-nocookie.com/embed/${cleanVideoId}` : ''),
      canonicalUrl: v.canonicalUrl || (cleanVideoId ? `https://www.youtube.com/watch?v=${cleanVideoId}` : rawUrl),
      status: 'unverified',
      embeddable: false,
      issues: [],
      fallbackCount: Array.isArray(v.fallbackResources) ? v.fallbackResources.length : (Array.isArray(v.fallbackResourceIds) ? v.fallbackResourceIds.length : 0),
      lastVerifiedAt: new Date().toISOString()
    });
  };

  // 1. Collect Phase Modules Videos
  ALL_MODULES.forEach(m => {
    m.topics?.forEach(t => {
      if (t.masteryPack?.primaryLecture) {
        addVideo(t.masteryPack.primaryLecture, `Module: ${m.title} (${m.id})`, t.id);
      }
    });
  });

  // 2. Collect CS Courses Videos
  COMPUTER_SCIENCE_COURSES.forEach(c => {
    c.sections?.forEach(s => {
      s.topics?.forEach(t => {
        if (t.masteryPack?.primaryLecture) {
          addVideo(t.masteryPack.primaryLecture, `CS Program: ${c.code} (${c.id})`, t.id);
        }
      });
    });
    c.lectures?.forEach((l, i) => {
      addVideo(l, `CS Program Extra: ${c.code} (${c.id})`, `${c.id}-extra-${i}`);
    });
  });

  // 3. Collect DS Courses Videos
  DATA_SCIENCE_COURSES.forEach(c => {
    c.sections?.forEach(s => {
      s.topics?.forEach(t => {
        if (t.masteryPack?.primaryLecture) {
          addVideo(t.masteryPack.primaryLecture, `DS Program: ${c.code} (${c.id})`, t.id);
        }
      });
    });
    c.lectures?.forEach((l, i) => {
      addVideo(l, `DS Program Extra: ${c.code} (${c.id})`, `${c.id}-extra-${i}`);
    });
  });

  console.log(`Discovered ${entries.length} video resources across curriculum.\n`);

  let verifiedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    process.stdout.write(`[${i + 1}/${entries.length}] Testing: ${entry.title.slice(0, 45).padEnd(45)} `);

    // Check 1: Ordinary webpage iframe check
    if (isNormalWebPage(entry.rawUrl) && !entry.videoId) {
      entry.status = 'embedding-disabled';
      entry.embeddable = false;
      entry.issues.push('Resource URL points to a normal webpage instead of a direct embeddable video.');
      failedCount++;
      console.log('❌ PAGE_IFRAME_BLOCKED');
      continue;
    }

    if (!entry.videoId) {
      entry.status = 'invalid-id';
      entry.embeddable = false;
      entry.issues.push('Missing or unparseable 11-character YouTube video ID.');
      failedCount++;
      console.log('❌ INVALID_VIDEO_ID');
      continue;
    }

    // Check 2: YouTube oEmbed Network Verification
    const oembedResult = await verifyYouTubeOembed(entry.videoId);
    if (oembedResult.ok) {
      entry.status = 'verified';
      entry.embeddable = true;
      verifiedCount++;
      console.log(`✅ VERIFIED (${oembedResult.author})`);
    } else {
      entry.embeddable = false;
      if (oembedResult.status === 404) {
        entry.status = 'not-found';
        entry.issues.push('YouTube video 404 Not Found (Deleted or non-existent ID).');
      } else if (oembedResult.status === 401) {
        entry.status = 'private';
        entry.issues.push('YouTube video 401 Unauthorized (Private, unlisted, or restricted video).');
      } else {
        entry.status = 'embedding-disabled';
        entry.issues.push(`YouTube returned HTTP status ${oembedResult.status}.`);
      }
      failedCount++;
      console.log(`❌ HTTP_${oembedResult.status}`);
    }
  }

  console.log('\n================================================================');
  console.log(`VERIFICATION SUMMARY:`);
  console.log(`Total Published Videos : ${entries.length}`);
  console.log(`Verified & Embeddable  : ${verifiedCount}`);
  console.log(`Failed / Unavailable    : ${failedCount}`);
  console.log('================================================================\n');

  // Write JSON Audit Report
  const reportPath = path.join(process.cwd(), 'video-verification-report.json');
  const reportData = {
    generatedAt: new Date().toISOString(),
    totalVideos: entries.length,
    verifiedCount,
    failedCount,
    successPercentage: ((verifiedCount / entries.length) * 100).toFixed(1) + '%',
    entries
  };

  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2), 'utf-8');
  console.log(`📁 Detailed verification report saved to: video-verification-report.json\n`);

  if (failedCount > 0) {
    console.error(`🚨 VERIFICATION FAILURE: ${failedCount} video(s) failed embeddability or availability checks.`);
    console.error('All failed videos must be replaced with verified academic sources before deployment.\n');
    process.exit(1);
  } else {
    console.log('🎉 SUCCESS: 100% of curriculum video resources are verified, playable, and embeddable!');
  }
}

runVideoVerificationPipeline().catch((err) => {
  console.error('Video verification pipeline encountered a critical error:', err);
  process.exit(1);
});
