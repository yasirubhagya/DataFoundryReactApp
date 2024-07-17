import { Authenticator } from "@aws-amplify/ui-react";
import { ServiceRequestForm } from "./components/ServiceRequestForm";
import { ServiceRequestList } from "./components/ServiceRequestList";
import "@aws-amplify/ui-react/styles.css"


function App() {

  return (
    <div className="flex w-full h-dvh justify-center items-center">
      <Authenticator>
        {({ signOut }) => (
          <main className="flex flex-col w-full h-full">
            <div className="flex w-full h-24 border border-gray-900/10 p-4 shadow fixed top-0 bg-white">
              <button onClick={signOut}>Sign out</button>
            </div>
            <div className="flex flex-col lg:flex-row w-full h-full pt-24">
              <div className="flex justify-center items-top">
                <ServiceRequestForm />
              </div>
              <div className="flex justify-center">
                <ServiceRequestList />
              </div>

            </div>
          </main>
        )}
      </Authenticator>
    </div>
  );
}

export default App;
