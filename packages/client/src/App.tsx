import React, { useState } from "react"
import ReactDOM from "react-dom"
import { QueryClient,QueryClientProvider } from "react-query"

import { trpc } from "./trpc"

import "./index.scss"

const client = new QueryClient();

const AppContent = () => {

  const getMessages = trpc.useQuery(["getMessages"])

  const addMessage = trpc.useMutation("addMessage")

  const onAdd = () => {
    addMessage.mutate({
      message: "YO world again",
      user: "Cris"
    }, {
      onSuccess: () => {
        client.invalidateQueries(["getMessages"])
      }
    },
  )}

  return (
    <div className="mt-10 text-3xl mx-auto max-w-6xl">
      <div>{JSON.stringify(getMessages.data)}</div>
      <button onClick={onAdd} >Add message</button>
    </div>
  )
}


const App = () => {

  const [trpcClient] = useState(() => 
    trpc.createClient({
      url:"http://localhost:8080/trpc"
    })
  )


  return (
    <trpc.Provider client={trpcClient} queryClient={client}>   
      <QueryClientProvider client={client} >
        <AppContent />
      </QueryClientProvider>
    </trpc.Provider>)
}
ReactDOM.render(<App />, document.getElementById("app"))
