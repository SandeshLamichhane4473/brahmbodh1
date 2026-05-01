import React , {useState, useEffect}from 'react';
import useLatestHomeBlog from '../../hooks/useLatestHomeBlog';
 import { fetchBlogBody } from '../fetchBlogBody';



const HomeBlog = () => {
     const [htmlContent, setHtmlContent] = useState("");
      const { homeBlog } = useLatestHomeBlog();

        useEffect(() => {
          if (homeBlog?.body_url) {
            fetchBlogBody(homeBlog.body_url).then(setHtmlContent);
          }
        }, [homeBlog]);
      


  return (<>
       <div style={{ fontFamily: 'your-font-name, serif' }}>
          <div
            className="prose max-w-none px-6 py-8 sm:px-10 sm:py-10 text-lg sm:text-xl leading-relaxed text-neutral-800"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
       </>
  );
};

export default HomeBlog;
