# VestibuleJS
Manage JavaScript a-synchronous lazy loading &amp; timing issues. Allow public methods to be called prior to loading your modules.

The "Vestibule" allows a team to define and map a public JavaScript API.  
Then, even without understanding module dependency, JS file locations or managing a-synchronous lazying loading & timing issues, another team can simply use that API.    

The required files are automatically lazy loaded "on-demand" based on the usage of that API.

Example usage:
```
//arg1 = "Public Method Name[s]":String/Array
//arg2 = "Script-Location.js":String

vestibule(['EXTERNAL_API_A','EXTERNAL_API_B'],'external-api.js'); - 
```

Now, another file can call EXTERNAL_API_A('');.  At that point 'external-api.js' will get loaded and the original call dispatched accordingly.  

See deploy folder for working demo.  Use ANT build.xml to compile source.

