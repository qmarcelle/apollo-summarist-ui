

Step One  
in the same location as bower.json, run this command in the terminal:
bower install https://github.com/qmarcelle-elemica/apollo-login.git -S

Step Two
include "apollo-login" as a dependency of the module for which login functionality is desired


Step 3
in the run method add "Auth", "session", and "user" services to the callback of the app's run method 


