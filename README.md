# ucode-cardgame

Hearthstone-like card game on NodeJS and Socket.io

![image](https://github.com/Raddzor01/ucode-cardgame/assets/75639391/431f3752-80b2-4389-a989-7f94711b46b0)

![image](https://github.com/Raddzor01/ucode-cardgame/assets/75639391/c5fbfe28-35d4-4464-8bb6-c359db997d0d)


## Installation

Before you begin, make sure you have [NodeJS](https://nodejs.org/) and [MySQL](https://www.mysql.com/) installed on your system.

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/Raddzor01/ucode-cardgame.git
   ```

2. Navigate to the project directory:

   ```bash
   cd ucode-cardgame
   ```

3. Initialize the database by running the SQL script located in the `db` directory:

   ```bash
   mysql -u your-mysql-username -p < db/db.sql
   ```

   Replace `your-mysql-username` with your MySQL username.

4. Install the required dependencies:

   ```bash
   npm install
   ```

## Usage

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open your web browser and go to [http://127.0.0.1:8000](http://127.0.0.1:8000).

## Contributing

If you would like to contribute to this project, feel free to submit issues or pull requests. 

## License

This project is licensed under the [MIT License](LICENSE).

