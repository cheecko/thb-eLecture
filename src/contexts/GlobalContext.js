import { createContext, useReducer } from 'react'
import { StudyProgram } from './../utils/constants'

const GlobalContext = createContext()

const GlobalReducer = (state, action) => {
    switch (action.type) {
        case 'getStudyProgram': {
            return {...state, studyProgram: StudyProgram}
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`)
        }
    }
}

const GlobalContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(GlobalReducer, {studyProgram: StudyProgram})
  
    return <GlobalContext.Provider value={{ state, dispatch }}>{children}</GlobalContext.Provider>
}

export { GlobalContext, GlobalContextProvider }