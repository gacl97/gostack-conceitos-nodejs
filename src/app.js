const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

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

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const projectId = repositories.findIndex(project => project.id === id);

  if(projectId < 0) {
    return res.status(400).json({ error: "Project not found." });
  }

  const { title, url, techs } = request.body;

  const project = {
    id,
    title,
    url,
    techs: repositories[projectId].techs.concat(techs),
  }
  
  repositories[projectId] = project;

  return response.json(project);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const projectId = repositories.findIndex(project => project.id === id);

  if(projectId < 0) {
    return res.status(400).json({ error: "Project not found." });
  }

  repositories.splice(id, 1);
  
  return res.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const projectId = repositories.findIndex(project => project.id === id);

  if(projectId < 0) {
    return res.status(400).json({ error: "Project not found." });
  }
  repositories[projectId].likes +=  1;

  const project = repositories[projectId];
  
  return response.json(project);
});

module.exports = app;
