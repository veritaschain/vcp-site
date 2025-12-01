#!/usr/bin/env python3
"""
Add JSON-LD structured data to key pages for SEO.
"""

import os
import re

# JSON-LD templates for different page types
ORGANIZATION_SCHEMA = '''    <!-- Structured Data - Organization -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "VeritasChain Standards Organization (VSO)",
        "alternateName": "VSO",
        "url": "https://veritaschain.org",
        "logo": "https://veritaschain.org/assets/img/logo.png",
        "sameAs": [
            "https://github.com/VeritasChain",
            "https://twitter.com/veritaschain"
        ],
        "description": "VeritasChain Standards Organization (VSO) maintains the VeritasChain Protocol (VCP), an open standard for recording algorithmic and AI-driven trading in an immutable, verifiable format.",
        "contactPoint": {
            "@type": "ContactPoint",
            "email": "contact@veritaschain.org",
            "contactType": "General"
        }
    }
    </script>'''

SOFTWARE_APPLICATION_SCHEMA = '''    <!-- Structured Data - SoftwareApplication -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "VeritasChain Protocol (VCP)",
        "alternateName": "VCP",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Any",
        "description": "An open cryptographic audit protocol for recording algorithmic and AI-driven trading decisions in an immutable, verifiable format. Compliant with MiFID II, EU AI Act, and GDPR.",
        "version": "1.0",
        "url": "https://veritaschain.org/vcp/specification/",
        "softwareRequirements": "Compatible with major programming languages and trading systems",
        "releaseNotes": "VCP v1.0 - The first open standard for algorithmic trading auditability",
        "author": {
            "@type": "Organization",
            "name": "VeritasChain Standards Organization (VSO)",
            "url": "https://veritaschain.org/vso"
        },
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
        },
        "featureList": [
            "Cryptographic audit trail",
            "MiFID II compliance",
            "EU AI Act compliance",
            "GDPR compliance",
            "Quantum-resistant security",
            "Real-time verification"
        ]
    }
    </script>'''

FAQ_PAGE_SCHEMA_TEMPLATE = '''    <!-- Structured Data - FAQPage -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is VC-Certified?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "VC-Certified is a certification program operated by VeritasChain Standards Organization (VSO) that verifies algorithmic trading systems comply with the VeritasChain Protocol (VCP) for cryptographic auditability."
                }
            },
            {
                "@type": "Question",
                "name": "What are the certification tiers?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "VC-Certified offers three tiers: Silver (basic compliance), Gold (advanced compliance with enhanced features), and Platinum (full compliance with all VCP requirements including quantum-resistant security)."
                }
            },
            {
                "@type": "Question",
                "name": "Is VC-Certified mandatory for MiFID II compliance?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "VC-Certified is not legally mandatory, but implementing the VCP standard can help demonstrate compliance with MiFID II record-keeping and audit trail requirements for algorithmic trading."
                }
            },
            {
                "@type": "Question",
                "name": "How long does certification take?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The certification process typically takes 2-4 weeks depending on the tier and complexity of the trading system being certified."
                }
            },
            {
                "@type": "Question",
                "name": "Who governs the VCP standard?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The VCP standard is maintained by the VeritasChain Standards Organization (VSO), an independent body committed to open standardization of algorithmic trading auditability."
                }
            }
        ]
    }
    </script>'''

ARTICLE_SCHEMA = '''    <!-- Structured Data - NewsArticle -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": "VSO Unveils VCP v1.0, a First-of-Its-Kind Cryptographic Audit Protocol to Restore Trust in AI-Driven Markets",
        "datePublished": "2025-11-26",
        "dateModified": "2025-11-26",
        "author": {
            "@type": "Organization",
            "name": "VeritasChain Standards Organization (VSO)"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Business Wire",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.businesswire.com/favicon.ico"
            }
        },
        "description": "VeritasChain Standards Organization (VSO) announces VCP v1.0, the world's first open cryptographic audit protocol for AI-driven and algorithmic trading systems.",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://www.businesswire.com/news/home/20251126171479/en/VSO-Unveils-VCP-v1.0-a-First-of-Its-Kind-Cryptographic-Audit-Protocol-to-Restore-Trust-in-AI-Driven-Markets"
        },
        "image": "https://veritaschain.org/assets/OGP.png"
    }
    </script>'''

WEBSITE_SCHEMA = '''    <!-- Structured Data - WebSite -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "VeritasChain Protocol (VCP)",
        "alternateName": "VeritasChain",
        "url": "https://veritaschain.org",
        "description": "VeritasChain Protocol (VCP) - An open standard for recording algorithmic and AI-driven trading in an immutable, verifiable format.",
        "inLanguage": ["en", "ja", "zh"],
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://veritaschain.org/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    }
    </script>'''

def add_schema_to_file(filepath, schema, schema_name):
    """Add JSON-LD schema to a file if not already present."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if schema already exists
        if 'application/ld+json' in content:
            print(f"  SKIP: {filepath} (already has structured data)")
            return False
        
        # Insert before </head>
        if '</head>' in content:
            content = content.replace('</head>', schema + '\n</head>')
        else:
            print(f"  ERROR: {filepath} - No </head> tag found")
            return False
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"  UPDATED: {filepath} ({schema_name})")
        return True
        
    except Exception as e:
        print(f"  ERROR: {filepath} - {e}")
        return False

def main():
    print("=" * 60)
    print("Adding Structured Data (JSON-LD) to Pages")
    print("=" * 60)
    
    updated_count = 0
    
    # 1. Homepage - Organization + WebSite schema
    print("\n1. Homepage (Organization + WebSite):")
    homepage_schema = ORGANIZATION_SCHEMA + '\n' + WEBSITE_SCHEMA
    if add_schema_to_file('./index.html', homepage_schema, 'Organization + WebSite'):
        updated_count += 1
    
    # 2. Japanese Homepage
    print("\n2. Japanese Homepage:")
    if add_schema_to_file('./ja/index.html', ORGANIZATION_SCHEMA, 'Organization'):
        updated_count += 1
    
    # 3. Chinese Homepage
    print("\n3. Chinese Homepage:")
    if add_schema_to_file('./zh/index.html', ORGANIZATION_SCHEMA, 'Organization'):
        updated_count += 1
    
    # 4. VCP Specification - SoftwareApplication schema
    print("\n4. VCP Specification (SoftwareApplication):")
    if add_schema_to_file('./vcp/specification/index.html', SOFTWARE_APPLICATION_SCHEMA, 'SoftwareApplication'):
        updated_count += 1
    
    # 5. FAQ Pages - FAQPage schema
    print("\n5. FAQ Pages (FAQPage):")
    faq_pages = [
        './certified/faq/index.html',
        './certified/faq/ja/index.html',
        './certified/faq/zh/index.html',
    ]
    for page in faq_pages:
        if os.path.exists(page):
            if add_schema_to_file(page, FAQ_PAGE_SCHEMA_TEMPLATE, 'FAQPage'):
                updated_count += 1
    
    # 6. Press/News - Article schema (for pages with news content)
    print("\n6. Press Pages (NewsArticle):")
    if add_schema_to_file('./press/index.html', ARTICLE_SCHEMA, 'NewsArticle'):
        updated_count += 1
    
    # 7. VSO Organization Page
    print("\n7. VSO Page (Organization):")
    if os.path.exists('./vso/index.html'):
        if add_schema_to_file('./vso/index.html', ORGANIZATION_SCHEMA, 'Organization'):
            updated_count += 1
    
    print("\n" + "-" * 60)
    print(f"Summary: Updated {updated_count} files with structured data")
    print("=" * 60)

if __name__ == "__main__":
    main()
