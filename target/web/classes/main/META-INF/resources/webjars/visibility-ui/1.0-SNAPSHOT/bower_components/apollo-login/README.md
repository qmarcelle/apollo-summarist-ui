

Step One  
in the same location as bower.json, run this command in the terminal:
bower install git@github.com:elemica/apollo-commons-ui.git -S

Step Two
include "apollo-login" as a dependency of the module for which login functionality is desired


Step 3
in the run method add "Auth", "session", and "user" services to the callback of the app's run method 


