import { useQuery, useMutation } from "react-query";
import React, { useEffect } from "react";
async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "PATCH", data: { title: "REACT QUERY FOREVER!!!!" } }
  );
  return response.json();
}

function PostDetail({ post }) {
  // replace with useQuery
  console.log("PostDetail rendered");
  // const { data, error, isLoading } = useQuery(["postComments", post.id], () =>
  //   fetchComments(post.id)
  // );
  const data = [];
  const deleteMutation = useMutation((postId) => deletePost(postId));
  const updateMutation = useMutation((postId) => updatePost(postId));
  useEffect(() => {
    deleteMutation.reset();
    updateMutation.reset();
  }, [post.id]);
  useEffect(() => {
    console.log(deleteMutation);
  }, [deleteMutation]);
  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
      {deleteMutation.isLoading && <p>Deletion in process</p>}
      {deleteMutation.isSuccess && <p>Deletion done</p>}
      {deleteMutation.isError && <p>Error Deleting the post</p>}
      <button onClick={() => updateMutation.mutate(post.id)}>
        Update title
      </button>
      {updateMutation.isLoading && <p>Updation in process</p>}
      {updateMutation.isSuccess && <p>Updation done</p>}
      {updateMutation.isError && <p>Error Updating the post</p>}
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.length !== 0 &&
        data.map((comment) => (
          <li key={comment.id}>
            {comment.email}: {comment.body}
          </li>
        ))}
    </>
  );
}
PostDetail = React.memo(PostDetail);
export { PostDetail };
