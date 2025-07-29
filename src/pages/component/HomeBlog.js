import React , {useState, useEffect}from 'react';
import useLatestHomeBlog from '../hooks/useLatestHomeBlog';
 import { fetchBlogBody } from './fetchBlogBody';



const HomeBlog = () => {
     const [htmlContent, setHtmlContent] = useState("");
      const { homeBlog } = useLatestHomeBlog();

        useEffect(() => {
          if (homeBlog?.body_url) {
            fetchBlogBody(homeBlog.body_url).then(setHtmlContent);
          }
        }, [homeBlog]);
      


  return (<>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
       </>
  );
};

export default HomeBlog;
