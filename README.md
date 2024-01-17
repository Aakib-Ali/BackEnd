# BackEnd

step 1:
>>>> npm init

step2:
insatall nodemon 
command 
>>>>>>> npm i -D nodemon

step3:
prettier configuration
npm i -D prettier
add
    .prettierignore :-  where we don't want to use prettier
        like we don't want to use pretier in .env,node_modules, and etc.
*.env
<!-- .env
.env.*
/.vscode
/node_modules
./dist -->

and in file .prettierrc what our team is decided for the code configuration like allow to use single cotation etc.
{
    <!-- "singleQuote": false,
    "bracketSpacing": true,
    "tabWidth": 2,
    "trailingComma": "es5",
    "semi": true
} -->

step 4:
update env file with your database url 
and import mongoose dotenv and express packages
commands

>>>>>>> npm i mongoose dotenv express

all three will be installed

step 5:
install cookie-parser and cors to maintain server request adn use some middleware

>>>>>>> npm i cookie-parser cors