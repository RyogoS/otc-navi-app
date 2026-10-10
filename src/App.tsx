import './App.css'
// import JobCard, {jobs} from './components/JobCard.tsx'
// import UserList from './components/UserList.tsx'
import MedicineList from './components/MedicineList.tsx'

function App() {

  return(
    <>
      <section id="center">
        <div>
          <h1>OTC医薬品</h1>
          <MedicineList/>
        </div>

        <div>
           {/* {jobs.map((job) => (
            <JobCard key={job.id} {...job} />
          ))} */}
        </div>
      </section>
    </>
  )
}

export default App
