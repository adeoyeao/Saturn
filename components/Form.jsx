import styles from "../styles/components/form.module.scss"
import { useState } from "react"
import { useRouter } from "next/router"

const Form = () => {
      const router = useRouter()

      const [ mode, setMode ] = useState("login")
      const [ heading, setHeading ] = useState("Welcome to Saturn")
      const [ input, setInput ] = useState({
            username: "",
            password: ""
      })

      const handleChange = (e) => {
            const { name, value } = e.target
            setInput(prev => ({
                  ...prev,
                  [name]: value
            }))
      }

      const handleSubmit = (e) => {
            e.preventDefault()
            fetch(`/${mode}`, {
                  method: "POST",
                  headers: {
                        "content-type": "application/json"
                  },
                  body: JSON.stringify({username: input.username, password: input.password})
            })
            .then(res => res.json())
            .then(response => {
                  setHeading(response.message)
                  setTimeout(() => router.push("/home"), 500)
            })
            .catch(err => {
                  console.error(err)
                  setInput({
                        username: "",
                        password: ""
                  })
            })
      }

      const handleOAuth = (oauth) => {
            router.push(`/auth/${oauth}`)
      } 

      const changeMode = () => {
            mode === "login" ? setMode("register") : setMode("login")
      }

      return (
            <form className={styles.Form} onSubmit={handleSubmit}>
                  <h1>{heading}</h1>
                  <div>
                        <input 
                        type="text"
                        name="username"
                        value={input.username}
                        placeholder="Username"
                        onChange={handleChange}
                        autoComplete="off"/>
                        <input 
                        type="password"
                        name="password"
                        value={input.password}
                        placeholder="Password"
                        onChange={handleChange}
                        autoComplete="off"/>
                        <button type="submit">{ mode === "login" ? "Sign in" : "Register" }</button>
                  </div>
                  <p>Or login with</p>
                  <span>
                        <button 
                        className={styles.Form_oauth___facebook}
                        onClick={(e) => (e.preventDefault(), handleOAuth("facebook"))}></button>
                        <button className={styles.Form_oauth___google}
                        onClick={(e) => (e.preventDefault(), handleOAuth("google"))}></button>
                  </span>
                  <a onClick={changeMode}>{ mode === "login" ? "Sign up" : "Sign in" }</a>
            </form>
      )
}

export default Form