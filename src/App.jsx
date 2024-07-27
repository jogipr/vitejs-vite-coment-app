import { useState } from 'react';
import './App.css';
import comments from './data/data.json';

const AddComment = ({ handleComment, comment, handleAddComment }) => {
  return (
    <div className="comments-container">
      <textarea
        name=""
        id=""
        cols="30"
        rows="5"
        onChange={handleComment}
        value={comment}
      ></textarea>
      <button onClick={handleAddComment}>Add Comments</button>
    </div>
  );
};

const Comment = ({ comment, handleReply }) => {
  const [toggle, setToggle] = useState(false);
  const [replyComment, handleReplyComment] = useState('');

  const toggleComment = () => {
    setToggle(!toggle);
  };

  const reply = () => {
    const commentToAdd = {
      id: Date.now(),
      comment: replyComment,
      votes: 0,
      replies: [],
    };
    handleReply(comment.id, commentToAdd);
    toggleComment();
  };

  return (
    <div className="comment__container">
      <div className="comment__text">{comment.comment}</div>
      <div>
        <button>Like</button>
        <button onClick={toggleComment}>Reply</button>
        <button>Delete</button>
      </div>
      {toggle && (
        <AddComment
          comment={replyComment}
          handleAddComment={reply}
          handleComment={(e) => handleReplyComment(e.target.value)}
        />
      )}
    </div>
  );
};

const CommentList = ({ commentList, level, handleReply }) => {
  const style = {
    marginLeft: `${level + 1}rem`,
  };

  return (
    <div className="comment-list-container" style={style}>
      {commentList.map((comment) => {
        if (comment.replies.length > 0) {
          return (
            <div key={comment.id}>
              <Comment
                key={comment.id}
                comment={comment}
                handleReply={handleReply}
              />
              <CommentList
                commentList={comment.replies}
                level={level + 1}
                handleReply={handleReply}
              />
            </div>
          );
        }
        return (
          <Comment
            key={comment.id}
            comment={comment}
            handleReply={handleReply}
          />
        );
      })}
    </div>
  );
};

function App() {
  const [comment, setComment] = useState('');
  const [localComments, setLocalComments] = useState(comments);

  const addComments = (id, comment, commentList) => {
    if (!id) {
      const updatedComment = {
        ...comment,
        id: Date.now(),
      };
      return [updatedComment, ...commentList];
    }
    const updatedComments = commentList?.map((comm) => {
      if (id == comm.id) {
        return {
          ...comm,
          replies: [comment, ...comm.replies],
        };
      } else if (comm.replies && comm.replies.length >= 0) {
        return { ...comm, replies: addComments(id, comment, comm.replies) };
      } else {
        return comm;
      }
    });
    return updatedComments;
  };

  const handleAddComment = () => {
    const commentToAdd = {
      comment,
      votes: 0,
      replies: [],
    };

    const updatedComments = addComments(null, commentToAdd, localComments);
    setLocalComments(updatedComments);
    console.log(updatedComments);
  };

  const handleComment = (e) => {
    setComment(e.target.value);
  };

  const handleReply = (id, comment) => {
    const updatedComments = addComments(id, comment, localComments);
    setLocalComments(updatedComments);
  };

  return (
    <>
      <header>Comment app</header>
      <AddComment
        comment={comment}
        handleAddComment={handleAddComment}
        handleComment={handleComment}
      />
      <CommentList
        commentList={localComments}
        level={0}
        handleReply={handleReply}
      />
    </>
  );
}

export default App;
