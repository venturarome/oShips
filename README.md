# oShips

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Status](#project-status)
- [Possible Improvements](#possible-improvements)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)


## Introduction
oShips is a project that features the power of GraphQL to provide an API with detailed information about spaceships from the game oGame, including their attributes and interactions during battles.

## Features
- **Comprehensive Ship Data**: Access detailed statistics and information for each ship in oGame.
- **Battle Relations**: Understand how different ships interact and counter each other in combat scenarios.
- **GraphQL Interface**: Utilize the flexibility and efficiency of GraphQL to query only the data you need.

## Technologies Used
- **TypeScript**: Ensures type safety and enhances code quality.
- **GraphQL**: Provides a robust and flexible API interface. Using [Yoga](https://github.com/dotansimha/graphql-yoga) as GraphQL server.
- **Node.js**: Serves as the runtime environment for executing JavaScript code on the server side.

## Project Status
This project is currently working as expected. It has some limitations compared to the current game dynamics and, hence, it represents a demo scenario and should not be used to simulate real scenarios.

The project could be extended to support more features, but I decided to stop as the initial aim of the project was to play around with the technologies involved, not to have a fully-fledged battle simulator.

## Possible Improvements
Technical:
- Use a proper database instead of a JSON file with in-memory changes.
- Stricter type safety.

Non-technical:
- Include defensive items.
- include player class bonuses and technology bonuses.
- Repeat simulation N times to get more likely results (median regression).
- Simulate confederated attacks.
- Add information of plundered resorces in simulations in case of attacker win.
- Add wreckage data, debris fields amount and defensive items recovery after battle.

## Getting Started
To set up the oShips API locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/venturarome/oShips.git
   cd oShips
   ````

2. **Install Dependencies**:
    ```bash
    npm install
    ````

3. **Start the server**:
    ```bash
    npm run start:dev
    ```

## Usage
Once the server is running, you can interact with the GraphQL API navigating to `http://localhost:5300/graphql` or using tools like Postman.

Here's an example query to fetch information about a specific ship:
```graphql
query Ship {
  ship(id: "1") {
    name
    description
    cost {
      resource {
        name
      }
      amount
    }
    shield_power
    weapon_power
    rapid_fire_against {
      ship {
        name
      }
      shots
      probability
    }
  }
}
```

## Contributing
Contributions are welcome. To contribute:
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with clear and concise messages.
4. Push your branch to your forked repository.
5. Open a pull request to the main repository.

## License
This project is licensed under the MIT License.

## Acknowledgements
Special thanks to the oGame community for providing comprehensive data and inspiration for this project.
