import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

async function fetchPosts(pageNumber) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNumber}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  // TODO: replace with useQuery
  // queryKey, queryFunction,
  const { data, isLoading, isError, error } = useQuery(
    ["posts", currentPage],
    () => fetchPosts(currentPage),
    {
      staleTime: 5000,
      keepPreviousData: true,
    }
  );
  const queryClient = useQueryClient();
  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery(["posts", nextPage], () =>
        fetchPosts(nextPage)
      );
    }
  }, [currentPage, queryClient]);
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Whoopsieee {error.toString()}</p>;
  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((previous) => {
              if (previous === 0) return 0;
              else return previous - 1;
            });
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage((previousState) => previousState + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
