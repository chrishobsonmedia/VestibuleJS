/**
 * Vestibule JS
 * @version 1.0.3
 
The "Vestibule" allows a team to define and map a public JavaScript API.  
Then, even without understanding module dependency, JS file locations or managing a-synchronous lazying loading & timing issues, another team can simply use that API.    

The required files are automatically lazy loaded "on-demand" based on the usage of that API.

Example usage:

//arg1 = "Public Method Name[s]":String/Array
//arg2 = "Script-Location.js":String

vestibule(['EXTERNAL_API_A','EXTERNAL_API_B'],'external-api.js'); - 

Now, another file can call EXTERNAL_API_A('');.  At that point 'external-api.js' will get loaded and the original call dispatched accordingly.  

See deploy folder for working demo.  Use ANT build.xml to compile source.

------

Copyright (c) 2015 Chris Hobson 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

 */

