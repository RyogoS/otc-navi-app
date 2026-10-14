import './App.css'
import MedicineList from './components/MedicineList.tsx'

function App() {

  return(
    <>
      <section id="center">
        <div>
          <h1>OTC医薬品</h1>
          <MedicineList/>
        </div>
      </section>
    </>
  )
}

export default App
