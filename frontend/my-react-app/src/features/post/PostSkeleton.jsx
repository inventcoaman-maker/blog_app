import React from "react";
import "./PostSkeleton.css";
import "./PostSkeleton.css";

const PostSkeleton = () => {
  return (
    <div className="post-card skeleton">
      <div className="post-image-container skeleton">
        <div className="skeleton-image"></div>
      </div>

      <div className="post-content">
        <div className="skeleton-title"></div>

        <div className="skeleton-category"></div>

        <div className="skeleton-text"></div>
        <div className="skeleton-text short"></div>

        <div className="post-tags">
          <div className="skeleton-tag"></div>
          <div className="skeleton-tag"></div>
          <div className="skeleton-tag short"></div>
        </div>

        <div className="post-footer">
          <div className="left">
            <div className="skeleton-author"></div>
            <div className="skeleton-date"></div>
          </div>
        </div>

        <div className="like_comment">
          <div className="icon_group">
            <div className="skeleton-icon"></div>
            <div className="skeleton-count"></div>
          </div>

          <div className="icon_group">
            <div className="skeleton-icon"></div>
            <div className="skeleton-count"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;
