import './App.css'
import MedicineList from './components/MedicineList.tsx'

function App() {

  return(
    <>
      <section id="center">
        <div>
          <h1>OTC医薬品</h1>
          <small>⚠️ 本アプリはプログラミング学習用に作成したものです。<br />
            情報が最新・正確とは限りません。<br />
            実際に薬を選ぶ・使うときは、医師・薬剤師・登録販売者に相談してください。
          </small>
          <MedicineList/>
        </div>
      </section>
    </>
  )
}

export default App
