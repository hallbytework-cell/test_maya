/**
 * SEO Indexing Debugger
 * Comprehensive tool to identify and fix "Crawled - Currently not indexed" issues
 * Use in development to validate SEO implementation
 */

import { verifyIndexingStatus, ensureIndexable, sanitizeUrlForIndexing } from "@/utils/seoUtils";
import { validateHreflang } from "@/lib/hreflang";

class SEOIndexingDebugger {
  constructor() {
    this.isEnabled = import.meta.env.MODE === 'development';
    this.report = {};
  }

  /**
   * Run complete SEO indexing audit
   */
  async runFullAudit() {
    if (!this.isEnabled) return null;
    
    console.warn('🔍 SEO INDEXING AUDIT STARTED');
    
    this.report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      issues: [],
      warnings: [],
      fixes: [],
      recommendations: [],
    };

    // Run individual checks
    this.checkMetaTags();
    this.checkCanonical();
    this.checkRobotsMeta();
    this.checkStructuredData();
    this.checkHreflang();
    this.checkMobileIndexing();
    this.checkDuplicateContent();
    this.checkImageIndexing();
    this.checkInternalLinks();
    this.checkPageQuality();

    this.printReport();
    return this.report;
  }

  /**
   * Check meta tags for indexing issues
   */
  checkMetaTags() {
    const title = document.querySelector('title');
    const description = document.querySelector('meta[name="description"]');
    const keywords = document.querySelector('meta[name="keywords"]');

    if (!title || !title.textContent) {
      this.report.issues.push('❌ Missing page title tag');
      this.report.fixes.push('✅ Add or update title tag');
    } else if (title.textContent.length < 30) {
      this.report.warnings.push(`⚠️ Title too short: "${title.textContent}"`);
    } else if (title.textContent.length > 60) {
      this.report.warnings.push(`⚠️ Title too long: "${title.textContent}" (${title.textContent.length} chars)`);
    }

    if (!description) {
      this.report.issues.push('❌ Missing meta description');
      this.report.fixes.push('✅ Add meta description (150-160 chars)');
    } else {
      const descContent = description.getAttribute('content');
      if (descContent.length < 100) {
        this.report.warnings.push(`⚠️ Description too short (${descContent.length} chars)`);
      } else if (descContent.length > 160) {
        this.report.warnings.push(`⚠️ Description too long (${descContent.length} chars)`);
      }
    }

    if (!keywords) {
      this.report.warnings.push('⚠️ No keywords meta tag (not critical for indexing)');
    }
  }

  /**
   * Check canonical URL
   */
  checkCanonical() {
    const canonical = document.querySelector('link[rel="canonical"]');
    
    if (!canonical) {
      this.report.warnings.push('⚠️ No canonical URL found');
    } else {
      const href = canonical.getAttribute('href');
      if (!href || href === '') {
        this.report.issues.push('❌ Canonical tag has no href attribute');
      } else if (href.includes('?utm_') || href.includes('?fbclid')) {
        this.report.issues.push(`❌ Canonical URL contains tracking parameters: ${href}`);
        this.report.fixes.push('✅ Remove tracking parameters from canonical URL');
      } else {
        this.report.recommendations.push(`✅ Canonical URL correctly set to: ${href}`);
      }
    }
  }

  /**
   * Check robots meta tag
   */
  checkRobotsMeta() {
    const robotsMeta = document.querySelector('meta[name="robots"]');
    
    if (!robotsMeta) {
      this.report.issues.push('❌ Missing robots meta tag - may cause indexing issues');
      this.report.fixes.push('✅ Add robots meta tag with "index, follow"');
    } else {
      const content = robotsMeta.getAttribute('content');
      if (content.includes('noindex')) {
        this.report.issues.push(`❌ Page has "noindex" directive: ${content}`);
        this.report.fixes.push('✅ Remove noindex directive to allow indexing');
        // Auto-fix attempt
        ensureIndexable();
        this.report.fixes.push('✅ Applied: ensureIndexable() to remove noindex');
      } else if (!content.includes('index')) {
        this.report.issues.push(`❌ Robots tag missing "index": ${content}`);
      } else {
        this.report.recommendations.push(`✅ Robots tag correctly allows indexing: ${content}`);
      }
    }

    // Check googlebot specific
    const googlebot = document.querySelector('meta[name="googlebot"]');
    if (!googlebot) {
      this.report.warnings.push('⚠️ No googlebot-specific meta tag');
    }
  }

  /**
   * Check structured data (JSON-LD)
   */
  checkStructuredData() {
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    
    if (jsonLdScripts.length === 0) {
      this.report.warnings.push('⚠️ No JSON-LD structured data found');
      this.report.recommendations.push('💡 Add JSON-LD schema (Organization, Product, or BreadcrumbList)');
    } else {
      this.report.recommendations.push(`✅ Found ${jsonLdScripts.length} JSON-LD schema(s)`);
      
      // Validate each schema
      jsonLdScripts.forEach((script, index) => {
        try {
          const schema = JSON.parse(script.textContent);
          if (!schema['@type']) {
            this.report.issues.push(`❌ JSON-LD schema ${index + 1} missing @type`);
          } else {
            this.report.recommendations.push(`  ✅ Schema ${index + 1}: ${schema['@type']}`);
          }
        } catch (e) {
          this.report.issues.push(`❌ JSON-LD schema ${index + 1} has invalid JSON: ${e.message}`);
        }
      });
    }
  }

  /**
   * Check hreflang tags
   */
  checkHreflang() {
    const hreflangTags = document.querySelectorAll('link[rel="alternate"][hreflang]');
    
    if (hreflangTags.length === 0) {
      this.report.recommendations.push('💡 No hreflang tags found (needed for multi-language/regional SEO)');
    } else {
      this.report.recommendations.push(`✅ Found ${hreflangTags.length} hreflang tag(s)`);
      
      hreflangTags.forEach(tag => {
        const hreflang = tag.getAttribute('hreflang');
        const href = tag.getAttribute('href');
        this.report.recommendations.push(`  ✅ ${hreflang}: ${href}`);
      });
    }

    // Validate hreflang
    const validation = validateHreflang(window.location.pathname);
    if (!validation.valid) {
      validation.issues.forEach(issue => {
        this.report.warnings.push(`⚠️ Hreflang: ${issue}`);
      });
    }
  }

  /**
   * Check mobile indexing setup
   */
  checkMobileIndexing() {
    const viewport = document.querySelector('meta[name="viewport"]');
    
    if (!viewport) {
      this.report.issues.push('❌ Missing viewport meta tag - CRITICAL for mobile indexing');
      this.report.fixes.push('✅ Add viewport meta tag: content="width=device-width, initial-scale=1.0"');
    } else {
      const content = viewport.getAttribute('content');
      if (content.includes('width=device-width')) {
        this.report.recommendations.push('✅ Mobile viewport correctly configured');
      } else {
        this.report.issues.push(`❌ Viewport not mobile-first: ${content}`);
      }
    }

    // Check mobile web app meta
    const mobileWebApp = document.querySelector('meta[name="mobile-web-app-capable"]');
    if (!mobileWebApp) {
      this.report.warnings.push('⚠️ No mobile-web-app-capable meta tag');
    }
  }

  /**
   * Check for duplicate content issues
   */
  checkDuplicateContent() {
    const url = new URL(window.location.href);
    
    // Check for tracking parameters
    const trackingParams = ['utm_source', 'utm_medium', 'fbclid', 'gclid', 'ref', 'potId'];
    const foundParams = trackingParams.filter(param => url.searchParams.has(param));
    
    if (foundParams.length > 0) {
      this.report.warnings.push(`⚠️ URL contains tracking parameters: ${foundParams.join(', ')}`);
      this.report.recommendations.push('💡 Use canonical URL to consolidate these variations');
    }

    // Check if canonical differs from current URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      const currUrl = sanitizeUrlForIndexing(window.location.href);
      const canonicalUrl = canonical.getAttribute('href');
      if (currUrl !== canonicalUrl) {
        this.report.recommendations.push(`💡 Current URL different from canonical (tracking params present)`);
      }
    }
  }

  /**
   * Check image indexing
   */
  checkImageIndexing() {
    const images = document.querySelectorAll('img');
    let imagesWithoutAlt = 0;

    images.forEach(img => {
      if (!img.getAttribute('alt')) {
        imagesWithoutAlt++;
      }
    });

    if (imagesWithoutAlt > 0) {
      this.report.warnings.push(`⚠️ ${imagesWithoutAlt} images without alt text (affects image indexing)`);
    } else {
      this.report.recommendations.push('✅ All images have alt text');
    }

    // Check OpenGraph image
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      this.report.recommendations.push(`✅ OpenGraph image set for social indexing`);
    }
  }

  /**
   * Check internal links
   */
  checkInternalLinks() {
    const internalLinks = document.querySelectorAll('a[href^="/"], a[href*="mayavriksh.in"]');
    
    if (internalLinks.length === 0) {
      this.report.warnings.push('⚠️ No internal links found');
    } else {
      this.report.recommendations.push(`✅ Found ${internalLinks.length} internal link(s)`);
      
      // Check for nofollow on internal links (bad practice)
      let nofollowInternal = 0;
      internalLinks.forEach(link => {
        if (link.getAttribute('rel')?.includes('nofollow')) {
          nofollowInternal++;
        }
      });

      if (nofollowInternal > 0) {
        this.report.warnings.push(`⚠️ ${nofollowInternal} internal links have nofollow (passes no PageRank)`);
      }
    }
  }

  /**
   * Check overall page quality
   */
  checkPageQuality() {
    // Check page length/content
    const bodyText = document.body.innerText.length;
    if (bodyText < 300) {
      this.report.issues.push(`❌ Page content very short (${bodyText} chars) - may be considered thin content`);
    }

    // Check headings structure
    const h1Tags = document.querySelectorAll('h1');
    if (h1Tags.length === 0) {
      this.report.issues.push('❌ No H1 tag found - important for SEO');
    } else if (h1Tags.length > 1) {
      this.report.warnings.push(`⚠️ Multiple H1 tags found (${h1Tags.length}) - should ideally have only 1`);
    } else {
      this.report.recommendations.push(`✅ Single H1 tag: "${h1Tags[0].textContent}"`);
    }

    // Check meta tags completion
    const title = document.querySelector('title');
    const description = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');

    if (title && description && ogTitle && ogDescription) {
      this.report.recommendations.push('✅ All critical meta tags present');
    }
  }

  /**
   * Print formatted report to console
   */
  printReport() {
    console.group('🔍 SEO INDEXING REPORT');
    
    if (this.report.issues.length === 0 && this.report.warnings.length === 0) {
      console.log('✅ No critical issues found!');
    } else {
      if (this.report.issues.length > 0) {
        console.group(`❌ CRITICAL ISSUES (${this.report.issues.length})`);
        this.report.issues.forEach(issue => console.log(issue));
        console.groupEnd();
      }

      if (this.report.warnings.length > 0) {
        console.group(`⚠️ WARNINGS (${this.report.warnings.length})`);
        this.report.warnings.forEach(warning => console.log(warning));
        console.groupEnd();
      }

      if (this.report.fixes.length > 0) {
        console.group(`🔧 SUGGESTED FIXES`);
        this.report.fixes.forEach(fix => console.log(fix));
        console.groupEnd();
      }

      if (this.report.recommendations.length > 0) {
        console.group(`💡 RECOMMENDATIONS`);
        this.report.recommendations.forEach(rec => console.log(rec));
        console.groupEnd();
      }
    }

    console.log('📊 Full Report:', this.report);
    console.groupEnd();
  }

  /**
   * Get report data programmatically
   */
  getReport() {
    return this.report;
  }

  /**
   * Check if page is properly indexable
   */
  isPageIndexable() {
    return this.report.issues.length === 0;
  }
}

export const seoDebugger = new SEOIndexingDebugger();

// Auto-run audit in development mode when SEO debugger is imported
if (import.meta.env.MODE === 'development') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      seoDebugger.runFullAudit();
    }, 1000);
  });
}
