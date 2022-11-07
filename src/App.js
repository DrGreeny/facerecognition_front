import React, { Component } from "react";
import "./App.css";
import Navigation from "./components/navigation/Navigation";
import Logo from "./components/logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/faceRecognition/FaceRecognition";
import Rank from "./components/rank/Rank";
import SignIn from "./components/signin/SignIn";
import ParticlesBg from "particles-bg";
import Register from "./components/Register/Register";

const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "signin",
  isSignedIn: false,
  user: {
    email: "",
    id: "",
    name: "",
    entries: 0,
    joined: "",
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }
  loadUser = (data) => {
    this.setState({
      user: {
        email: data.email,
        id: data.id,
        name: data.name,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };
  calculateFaceLocation = (data) => {
    console.log("Jetzt kommt der data", data);
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    console.log("Jetzt kommt der 1.");
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };
  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };
  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });

    fetch("https://aqueous-shelf-66745.herokuapp.com/imageUrl", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: this.state.input,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          console.log("jetzt kommt der Image Count");
          fetch("https://aqueous-shelf-66745.herokuapp.com/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              console.log(count);
              this.setState(Object.assign(this.state.user, count));
            });
        }
        // console.log("Jetzt kommt der displayBox", response);
        /*      response
          //.json()
          .then((result) => console.log("Jetzt kommt das result", result))
          .then((result) =>
            this.displayFaceBox(this.calculateFaceLocation(result))
          ) */

        // console.log(result.outputs[0].data.regions[0].region_info.bounding_box)

        // .catch((error) => console.log("error", error));
        console.log("Response kommt: ", response);
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch(console.log);
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true} num={400} color="#A042FA" />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition imageUrl={imageUrl} box={box} />
          </div>
        ) : route === "signin" ? (
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
