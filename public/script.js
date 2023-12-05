const getTeams = async () => {
    try {
      return (await fetch("api/teams/")).json();
    } catch (error) {
      console.log(error);
    }
  };
  
  const showTeams = async () => {
    let teams = await getTeams();
    let teamsDiv = document.getElementById("team-list");
    teamsDiv.innerHTML = "";
    teams.forEach((team) => {
      const section = document.createElement("section");
      section.classList.add("team");
      teamsDiv.append(section);
  
      const a = document.createElement("a");
      a.href = "#";
      section.append(a);
  
      const h3 = document.createElement("h3");
      h3.innerHTML = team.name;
      a.append(h3);
  
      const img = document.createElement("img");
      img.src = team.img;
      section.append(img);
  
      a.onclick = (e) => {
        e.preventDefault();
        displayDetails(team);
      };
    });
  };
  
  const displayDetails = (team) => {
    const teamDetails = document.getElementById("team-details");
    teamDetails.innerHTML = "";
  
    const h3 = document.createElement("h3");
    h3.innerHTML = team.name;
    teamDetails.append(h3);
  
    const dLink = document.createElement("a");
    dLink.innerHTML = "	&#x2715;";
    teamDetails.append(dLink);
    dLink.id = "delete-link";
  
    const eLink = document.createElement("a");
    eLink.innerHTML = "&#9998;";
    teamDetails.append(eLink);
    eLink.id = "edit-link";
  
    const p = document.createElement("p");
    teamDetails.append(p);
    p.innerHTML = (`Owner: ${team.owner}`);
  
    const ul = document.createElement("ul");
    teamDetails.append(ul);
    console.log(team.owner);
    team.legends.forEach((legend) => {
      const li = document.createElement("li");
      ul.append(li);
      li.innerHTML = (`legends: ${legend}`);
    });
  
    eLink.onclick = (e) => {
      e.preventDefault();
      document.querySelector(".dialog").classList.remove("transparent");
      document.getElementById("add-edit-title").innerHTML = "Edit Team";
    };
  
    dLink.onclick = (e) => {
      e.preventDefault();
      deleteTeam(team);
    };
  
    populateEditForm(team);
  };
  
  const deleteTeam = async (team) => {
    let response = await fetch(`/api/teams/${team._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
  
    if (response.status != 200) {
      console.log("error deleting");
      return;
    }
  
    let result = await response.json();
    showTeams();
    document.getElementById("team-details").innerHTML = "";
    resetForm();
  };
  
  const populateEditForm = (team) => {
    const form = document.getElementById("add-edit-team-form");
    form._id.value = team._id;
    form.name.value = team.name;
    form.description.value = team.owner;
    populatePlayer(team);
  };
  
  const populatePlayer = (team) => {
    const section = document.getElementById("player-boxes");
  
    team.legends.forEach((legend) => {
      const input = document.createElement("input");
      input.type = "text";
      input.value = legend;
      section.append(input);
    });
  };
  
  const addEditTeam = async (e) => {
    e.preventDefault();
    const form = document.getElementById("add-edit-team-form");
    const formData = new FormData(form);
    let response;
    formData.append("legends", getLegends());
  
    //add a new team
    if (form._id.value == -1) {
      formData.delete("_id");
  
      response = await fetch("/api/teams", {
        method: "POST",
        body: formData,
      });
    }
    //edit an existing team
    else {
      console.log(...formData);
  
      response = await fetch(`/api/teams/${form._id.value}`, {
        method: "PUT",
        body: formData,
      });
    }
  
    //successfully got data from server
    if (response.status != 200) {
      console.log("Error posting data");
    }
  
    team = await response.json();
  
    if (form._id.value != -1) {
      displayDetails(team);
    }
  
    resetForm();
    document.querySelector(".dialog").classList.add("transparent");
    showTeams();
  };
  
  const getLegends = () => {
    const inputs = document.querySelectorAll("#player-boxes input");
    let legends = [];
  
    inputs.forEach((input) => {
      legends.push(input.value);
    });
  
    return legends;
  };
  
  const resetForm = () => {
    const form = document.getElementById("add-edit-team-form");
    form.reset();
    form._id = "-1";
    document.getElementById("player-boxes").innerHTML = "";
  };
  
  const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-edit-title").innerHTML = "Add Team";
    resetForm();
  };
  
  const addLegend = (e) => {
    e.preventDefault();
    const section = document.getElementById("player-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
  };
  
  window.onload = () => {
    showTeams();
    document.getElementById("add-edit-team-form").onsubmit = addEditTeam;
    document.getElementById("add-link").onclick = showHideAdd;
  
    document.querySelector(".close").onclick = () => {
      document.querySelector(".dialog").classList.add("transparent");
    };
  
    document.getElementById("add-player").onclick = addLegend;
  };