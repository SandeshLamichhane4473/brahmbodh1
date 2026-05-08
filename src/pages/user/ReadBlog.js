// src/pages/ViewBlog.js
import React, {   useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useBlogIdDetails from '../hooks/useBlogIdDetails';
import { FaShareAlt } from 'react-icons/fa';
import SocialShare from '../component/SocialShare';
import useLatestBlogs from '../hooks/useLatestBlogs';

const SITE_NAME = 'ब्रह्मबोध';
const SITE_URL = 'https://brahmbodh.netlify.app';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`; // Add a 1200x630 image to your /public folder

const ViewBlog = () => {
  const { id: fullId } = useParams();
  const blogId = fullId.split('/')[0];

  const { blogIdDetails: blog, loadingId, htmlBody } = useBlogIdDetails(blogId);
  const { latestBlogs, loading } = useLatestBlogs();

  const [showShareModal, setShowShareModal] = useState(false);
  const [showShareModalLink, setShowShareModalLink] = useState('');

  function createShareLink(blog) {
    if (!blog || !blog.slug || !blog.timestamp) return;
    const shareableLink = `${window.location.origin}/readblog/${blog.timestamp}/${blog.slug}`;
    setShowShareModalLink(shareableLink);
    setShowShareModal(true);
  }

  // Derived meta values from your actual Firestore field names
  const pageTitle = blog?.header
    ? `${blog.header} | ${SITE_NAME}`
    : SITE_NAME;

  const pageDescription = blog?.header
    ? `${blog.header} — ${blog.category || ''} | ${SITE_NAME}`
    : `${SITE_NAME} — तिमी मलाई समय देउ म तिमीलाई वेदान्त दिन्छु`;

  const pageImage = blog?.image_url || DEFAULT_OG_IMAGE;

  const pageUrl = blog
    ? `${SITE_URL}/readblog/${blog.timestamp}/${blog.slug}`
    : window.location.href;

  if (loadingId) return <p>Loading blog...</p>;

  return (
    <>
      {/* ===================== META TAGS ===================== */}
      <Helmet>
        {/* Standard */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph — used by Facebook, WhatsApp, LinkedIn, Telegram */}
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={blog?.header || SITE_NAME} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="ne_NP" />

        {/* Article-specific (Facebook/LinkedIn use these) */}
        {blog?.timestamp && (
          <meta
            property="article:published_time"
            content={new Date(blog.timestamp).toISOString()}
          />
        )}
        {blog?.category && (
          <meta property="article:section" content={blog.category} />
        )}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog?.header || SITE_NAME} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />

        {/* Schema.org JSON-LD — helps Google show rich snippets */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: blog?.header || SITE_NAME,
            description: pageDescription,
            image: pageImage,
            url: pageUrl,
            datePublished: blog?.timestamp
              ? new Date(blog.timestamp).toISOString()
              : undefined,
            articleSection: blog?.category,
            publisher: {
              '@type': 'Organization',
              name: SITE_NAME,
              url: SITE_URL,
            },
          })}
        </script>
      </Helmet>
      {/* ===================================================== */}

      <div className="bg-gray-100 min-h-screen py-10">
        <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-10 gap-1">

          {/* Blog Content */}
          {!blog ? (
            <h1 className="text-2xl px-5 font-semibold text-gray-800">Oops! 😎✨</h1>
          ) : (
            <div className="col-span-1 lg:col-span-8 bg-white p-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {blog?.header}
              </h1>
              <p className="text-sm text-gray-500 mb-4 flex items-center flex-wrap gap-2">
                📅 {new Date(blog?.timestamp).toDateString()} | 🏷 {blog?.category}
                <FaShareAlt
                  className="text-gray-500 hover:text-gray-400 cursor-pointer ml-2"
                  onClick={() => createShareLink(blog)}
                  title="Share Blog"
                />
              </p>

              <img
                src={blog?.image_url}
                alt={blog.header}
                className="w-full max-h-[500px] object-contain rounded-md shadow mb-6"
              />

              <div
                dangerouslySetInnerHTML={{ __html: htmlBody }}
                className="prose prose-lg max-w-none mt-6"
              />
            </div>
          )}

          {/* Recent Blogs Sidebar */}
          <div className="col-span-1 lg:col-span-2 bg-gray-100 p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Recent Blogs</h3>
            {loading ? (
              <p>Loading latest blogs...</p>
            ) : latestBlogs.length === 0 ? (
              <p>No blogs found.</p>
            ) : (
              <ul className="space-y-4">
                {latestBlogs.map((b) => (
                  <li key={b.timestamp}>
                    <a
                      href={`/readblog/${b.timestamp}/${b.slug || ''}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {b.header}
                    </a>
                    <p className="text-sm text-gray-500">
                      {new Date(b?.timestamp).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {showShareModal && (
          <SocialShare
            link={showShareModalLink}
            onClose={() => setShowShareModal(false)}
          />
        )}
      </div>
    </>
  );
};

export default ViewBlog;