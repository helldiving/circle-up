**Recap of progress so far**

**_Confirm this is accurate and make sure you haven't made a mistake anywhere in explaining_**

Created atoms. Each atom is a state. We can use atoms where ever we want - as long as the application (BrowserRouter in main.jsx) is wrapped in the <RecoilRoot></RecoilRoot> component.

Then we made authAtom.js for the authentication screen - which is either login or sign up (login by default).

Then we have userAtom.js which by default we get from local storage or the object is null.

In our AuthPage.jsx (authentication page), the authAtom.js is controlled by login = shows LoginCard, if not = shows SignupCard.

Inside the SignupCard we have our state. Once we click the sign up button, a FETCH request goes to our API and if there's any error, we show the toast and return out of the function.

Otherwise, the new user is set to our local storage and our state is updating. Since state is updated in the app.jsx, the user is navigating to the home page. If the user logs out with the log out button, the user is cleared, taking the person from their homepage to the authentication page with <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth"/>/> in App.jsx.
