<h1>🚀 Learnato Discussion Forum — Real-Time Microservice</h1>

<h2>🌍 Live Deployments</h2>
<ul>
  <li><strong>Frontend (Vercel):</strong> https://learnato-yash.vercel.app</li>
  <li><strong>Backend (Render):</strong> https://learnato-yash.onrender.com</li>
</ul>
<p>Render takes a minute or two when it is inactive for more than 15 minutes</p>

<hr/>

<h2>🧠 Project Overview</h2>
<p>
A real-time discussion forum microservice built for the Learnato Hackathon. Users can create posts, reply, upvote, mark as answered, and interact in real-time via Socket.io.
</p>

<hr/>

<h2>🛠️ Tech Stack</h2>

<h3>Frontend</h3>
<ul>
  <li>React.js</li>
  <li>Tailwind CSS (v4)</li>
  <li>Socket.io Client</li>
</ul>

<h3>Backend</h3>
<ul>
  <li>Node.js</li>
  <li>Express.js</li>
  <li>MongoDB (Atlas)</li>
  <li>Mongoose</li>
  <li>Socket.io</li>
  <li>CORS</li>
</ul>

<h3>DevOps & Deployment</h3>
<ul>
  <li>Render (Backend)</li>
  <li>Vercel (Frontend)</li>
  <li>MongoDB Atlas</li>
</ul>

<hr/>

<h2>✨ Features</h2>

<h3>Core Features</h3>
<ul>
  <li>Create a post (title + content)</li>
  <li>View list of posts</li>
  <li>Single post view with replies</li>
  <li>Add replies</li>
  <li>Upvote a post</li>
  <li>Responsive UI</li>
</ul>

<h3>Stretch Features Implemented</h3>
<ul>
  <li>Search posts</li>
  <li>Sort posts (Newest / Top Votes)</li>
  <li>Mark as Answered (only by author)</li>
  <li>Mock Login (<code>localStorage</code>)</li>
  <li>AI Suggestions — Similar titles</li>
  <li>Live updates with Socket.io</li>
  <li>One-like-per-user (unique user validation)</li>
</ul>

<hr/>

<h2>📡 API Endpoints</h2>
<p><strong>All backend routes are prefixed with:</strong> <code>/api</code></p>

<ul>
  <li><strong>POST /posts</strong> — Create a new post</li>
  <li><strong>GET /posts</strong> — Fetch all posts (supports search + sort)</li>
  <li><strong>GET /posts/:id</strong> — Get single post with replies</li>
  <li><strong>POST /posts/:id/reply</strong> — Add a new reply</li>
  <li><strong>POST /posts/:id/upvote</strong> — Upvote a post (one per user)</li>
  <li><strong>POST /posts/:id/markAnswered</strong> — Mark post as answered</li>
  <li><strong>GET /posts/:id/similar</strong> — AI suggestion route</li>
</ul>

<hr/>

<h2>⚡ Real-time Events (Socket.io)</h2>
<table>
<tr><th>📡 Event</th><th>📝 Trigger</th></tr>
<tr><td><code>new_post</code></td><td>When a user creates a post</td></tr>
<tr><td><code>new_reply</code></td><td>When a user replies</td></tr>
<tr><td><code>post_upvoted</code></td><td>When a post is upvoted</td></tr>
<tr><td><code>post_answered</code></td><td>When marked answered</td></tr>
</table>
