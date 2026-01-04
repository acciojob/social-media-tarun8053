
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import './../styles/App.css';

const users = [
  { id: "1", name: "Tarun" },
  { id: "2", name: "Aman" },
  { id: "3", name: "Neha" }
];

const initialPosts = [
  {
    id: "1",
    title: "Hello World",
    content: "First post",
    userId: "3",
    reactions: [0, 0, 0, 0, 0]
  }
];

const App = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <BrowserRouter>
      <div className="App">
        {/* Do not remove the main div */}

        <h1>GenZ</h1>

        <nav>
          <a href="/">Posts</a>{" "}
          <a href="/users">Users</a>{" "}
          <a href="/notifications">Notifications</a>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <AddPost posts={posts} setPosts={setPosts} />
                <PostsList posts={posts} setPosts={setPosts} />
              </>
            }
          />
          <Route path="/posts/:id" element={<PostDetail posts={posts} />} />
          <Route path="/edit/:id" element={<EditPost posts={posts} setPosts={setPosts} />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserPosts posts={posts} />} />
          <Route
            path="/notifications"
            element={
              <Notifications
                show={showNotifications}
                setShow={setShowNotifications}
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

/* ---------- Components ---------- */

const AddPost = ({ posts, setPosts }) => {
  const submit = (e) => {
    e.preventDefault();
    setPosts([
      ...posts,
      {
        id: Date.now().toString(),
        title: e.target.postTitle.value,
        content: e.target.postContent.value,
        userId: e.target.postAuthor.value,
        reactions: [0, 0, 0, 0, 0]
      }
    ]);
    e.target.reset();
  };

  return (
    <form onSubmit={submit}>
      <input id="postTitle" />
      <select id="postAuthor">
        {users.map((u) => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>
      <textarea id="postContent"></textarea>
      <button type="submit">Add Post</button>
    </form>
  );
};

const PostsList = ({ posts, setPosts }) => {
  const react = (pIndex, rIndex) => {
    if (rIndex === 4) return;
    const copy = [...posts];
    copy[pIndex].reactions[rIndex]++;
    setPosts(copy);
  };

  return (
    <section className="posts-list">
      <div>Posts</div>

      {posts.map((p, i) => (
        <div key={p.id} className="post">
          <h3>{p.title}</h3>
          <p>{p.content}</p>

          <Link className="button" to={`/posts/${p.id}`}>View</Link>

          {p.reactions.map((r, idx) => (
            <button key={idx} onClick={() => react(i, idx)}>
              {r}
            </button>
          ))}
        </div>
      ))}
    </section>
  );
};

const PostDetail = ({ posts }) => {
  const { id } = useParams();
  const post = posts.find(p => p.id === id);

  return (
    <div className="post">
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <Link className="button" to={`/edit/${id}`}>Edit</Link>
    </div>
  );
};

const EditPost = ({ posts, setPosts }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = posts.find(p => p.id === id);

  const save = () => {
    setPosts([...posts]);
    navigate(`/posts/${id}`);
  };

  return (
    <div className="post">
      <input
        id="postTitle"
        defaultValue={post.title}
        onChange={(e) => (post.title = e.target.value)}
      />
      <textarea
        id="postContent"
        defaultValue={post.content}
        onChange={(e) => (post.content = e.target.value)}
      />
      <button className="button" onClick={save}>Save</button>
    </div>
  );
};

const Users = () => (
  <ul>
    {users.map(u => (
      <li key={u.id}>
        <Link to={`/users/${u.id}`}>{u.name}</Link>
      </li>
    ))}
  </ul>
);

const UserPosts = ({ posts }) => {
  const { id } = useParams();
  return (
    <>
      {posts
        .filter(p => p.userId === id)
        .map(p => (
          <div key={p.id} className="post">{p.title}</div>
        ))}
    </>
  );
};

const Notifications = ({ show, setShow }) => (
  <>
    <button className="button" onClick={() => setShow(true)}>
      Refresh Notifications
    </button>

    <section className="notificationsList">
      {show && <div>Notification</div>}
    </section>
  </>
);

export default App;
