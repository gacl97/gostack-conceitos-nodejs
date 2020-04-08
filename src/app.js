const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function verifyId(req, res, next) {
  const { id } = req.params;

  if(!isUuid(id)) {
    return res.status(400).json({ error: "Invalid id. "});
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const project = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }
  repositories.push(project);

  return response.json(project);
});

app.put("/repositories/:id", verifyId, (request, response) => {
  const { id } = request.params;

  const projectId = repositories.findIndex(project => project.id === id);

  if(projectId < 0) {
    return response.status(400).json({ error: "Project not found." });
  }

  const { title, url, techs } = request.body;
  const { likes } = repositories[projectId];

  const project = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[projectId] = project;

  return response.json(project);
});

app.delete("/repositories/:id", verifyId, (req, res) => {
  const { id } = req.params;

  const projectId = repositories.findIndex(project => project.id === id);

  if(projectId < 0) {
    return res.status(400).json({ error: "Project not found." });
  }

  repositories.splice(projectId, 1);
  
  return res.status(204).json();
});

app.post("/repositories/:id/like", verifyId, (request, response) => {
  const { id } = request.params;

  const projectId = repositories.findIndex(project => project.id === id);

  if(projectId < 0) {
    return response.status(400).json({ error: "Project not found." });
  }
  repositories[projectId].likes +=  1;

  const project = repositories[projectId];
  
  return response.json(project);
});

module.exports = app;
