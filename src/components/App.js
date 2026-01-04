import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";

/* -------------------- INITIAL DATA -------------------- */

const users = [
  { id: 1, name: "User 1" },
  { id: 2, name: "User 2" },
  { id: 3, name: "User 3" },
];

const initialPosts = [
  {
    id: 1,
    title: "First Post",
    content: "Hello World",
    userId: 1,
    reactions: [0, 0, 0, 0, 0],
  },
];

/* -------------------- POSTS PAGE -------------------- */

function Posts({ posts, setPosts }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const addPost = (e) => {
    e.preventDefault();
    const newPost = {
      id: Date.now(),
      title,
      content,
      userId: Number(author),
      reactions: [0, 0, 0, 0, 0],
    };
    setPosts([posts[0], newPost]);
    setTitle("");
    setAuthor("");
    setContent("");
  };

  const react = (postIndex, reactionIndex) => {
    if (reactionIndex === 4) return;
    const updated = [...posts];
    updated[postIndex].reactions[reactionIndex]++;
    setPosts(updated);
  };

  return (
    <>
      <h1>GenZ</h1>

      <nav className="App">
        <a href="/">Posts</a>
        <a href="/users">Users</a>
        <a href="/notifications">Notifications</a>
        <a href="/">Create</a>
      </nav>

      <form onSubmit={addPost}>
        <input
          id="postTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          id="postAuthor"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        >
          <option value=""></option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
        <textarea
          id="postContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Save Post</button>
      </form>

      <div className="posts-list">
        <div></div>

        {posts.slice(1).map((post, index) => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>

            {post.reactions.map((count, i) => (
              <button key={i} onClick={() => react(index + 1, i)}>
                {count}
              </button>
            ))}

            <button
              className="button"
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              View
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

/* -------------------- POST DETAIL -------------------- */

function PostDetail({ posts, setPosts }) {
  const { id } = useParams();
  const post = posts.find((p) => p.id === Number(id));
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const save = () => {
    setPosts(
      posts.map((p) =>
        p.id === post.id ? { ...p, title, content } : p
      )
    );
    navigate("/");
  };

  return (
    <div className="post">
      {edit ? (
        <>
          <input
            id="postTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            id="postContent"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button onClick={save}>Save</button>
        </>
      ) : (
        <>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <button className="button" onClick={() => setEdit(true)}>
            Edit
          </button>
        </>
      )}
    </div>
  );
}

/* -------------------- USERS -------------------- */

function Users({ posts }) {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <ul>
        {users.map((u) => (
          <li key={u.id} onClick={() => setSelected(u.id)}>
            {u.name}
          </li>
        ))}
      </ul>

      {selected &&
        posts
          .filter((p) => p.userId === selected)
          .map((p) => (
            <div key={p.id} className="post">
              {p.title}
            </div>
          ))}
    </>
  );
}

/* -------------------- NOTIFICATIONS -------------------- */

function Notifications() {
  const [show, setShow] = useState(false);

  return (
    <>
      <button className="button" onClick={() => setShow(true)}>
        Refresh Notifications
      </button>

      <section className="notificationsList">
        {show && <div>New Notification</div>}
      </section>
    </>
  );
}

/* -------------------- APP -------------------- */

export default function App() {
  const [posts, setPosts] = useState(initialPosts);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Posts posts={posts} setPosts={setPosts} />} />
        <Route
          path="/posts/:id"
          element={<PostDetail posts={posts} setPosts={setPosts} />}
        />
        <Route path="/users" element={<Users posts={posts} />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </BrowserRouter>
  );
}
