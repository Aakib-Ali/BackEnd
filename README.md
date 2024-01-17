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

step 6:
install mongoose-aggregate-paginate for more user freindly

>>>>>>npm i mongoose-aggregate-paginate-v2

step 7:
install jsonwebtoken(jwt) and bcrypt it's help to secure password generate salt hash value of pass word and cryptography using bcrypt

>>>>>>>>npm i bcrypt jsonwebtoken

step 8:
install cloudnary to upload files on third party cloudnary and store there with the help of multer and install it also

>>>>>>>npm i multer
>>>>>>>npm install cloudinary

use multer to upload file on localstorage and use cloudinary to upload file on cloud