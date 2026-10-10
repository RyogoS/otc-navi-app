// React（リアクト）という道具箱から、2つの便利な道具を取り出す
// useState：データを入れておく「魔法の箱」を作る道具
// useEffect：画面が開いた時や、入力が変わった時に「自動で通信する」道具
import { useState, useEffect } from "react";

// インターネットから届く「お薬データ」の形をあらかじめ決めておく設計図
// 「idは数字、nameは文字、categoryは分類、symptomsは症状のリストが入るよ！」と教えています
type Medicine = {
  id: number; // お薬の識別番号
  name: string; // お薬の名前（例："〇〇頭痛薬"）
  category: string; // お薬の種類・分類（例："解熱鎮痛薬"）
  symptoms: string[]; // 効く症状のリスト（例：["頭痛", "熱"]）
};

export default function MedicineList() {
  // ── 1. データをしまっておく3つの魔法の箱（state） ──

  // ① お薬の一覧データを入れる箱（最初は空っぽ [] からスタート）
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  // ② 検索欄に入力された文字（症状）を入れる箱（最初は文字なし "" からスタート）
  const [symptom, setSymptom] = useState<string>("");

  // ③ 通信トラブルが起きた時のエラーメッセージを入れる箱
  const [errorBox, setError] = useState<string>("");

  // 画面読み込み時点
  const [isLoading, setIsLoading] = useState<boolean>(true);


  // ── 2. 文字入力欄の監視係 ──
  // ユーザーが検索欄に文字を入力するたびに呼び出されて、文字の箱（symptom）を新しく書き換えます
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSymptom(e.target.value); // 入力された最新の文字を保存！
  };


  // ── 3. お薬データの注文係（useEffect） ──
  // 検索欄の文字（symptom）が変わるたびに、バックエンド（サーバー）にお薬データを貰いに行くよ！
  useEffect(() => {

    setIsLoading(true);
    // 指定した症状（symptom）に合うお薬をサーバーに注文する（fetch）
    fetch(`http://localhost:3000/medicines?symptom=${symptom.trim()}`)
      .then((response) => {
        // サーバーから失敗の返事（500など）が来たらエラーにする
        if (!response.ok) {
          throw new Error(`薬の情報を取得できませんでした`);
        }
        // 無事にお返事が来たら、受け取ったデータをJavascriptで使える形（JSON）に変換する
        return response.json();
      })
      .then((data: Medicine[]) => {

        setIsLoading(false);
        // 届いたお薬データを「medicines」の箱に入れる
        setMedicines(data);
        // 成功したから、エラーメッセージの箱は空っぽ（きれいな状態）に戻す
        setError("");
      })
      .catch((error) => {

        setIsLoading(false);
        // もし通信失敗などの問題が起きたら、エラーの箱にメッセージを入れる
        setError(`薬の情報を取得できませんでした`);
        console.error(error); // パソコンの画面裏（コンソール）にも記録を残す
      });
  }, [symptom]); // ← 「symptom（検索文字）」が書き換わるたびに、この注文係がもう一度自動で動くよ！


  // ── 4. 画面（HTML）の見た目をつくる部分 ──
  return (
    <div>
      <h2>症状・成分</h2>

      {/* 検索用の入力欄 */}
      <input
        type="text"
        value={symptom}
        onChange={handleChange}
        placeholder="ここに入力"
      />

      {/* 入力された文字のリアルタイム確認用 */}
      <p>入力内容: {symptom}</p>

      {/* エラーメッセージの表示場所 */}
      <p>{errorBox}</p>

      
      {isLoading && <p>検索中...</p>}

      {/* 検索結果が0件のときだけ表示 */}
      {!isLoading
        && medicines.length === 0
        && errorBox === ""
        && <p>該当する薬が見つかりませんでした</p>}

      {/* お薬データのリストを1つずつ順番に並べて表示する（map処理） */}
      <ul>
        {medicines.map((medicine: Medicine) => (
          <li key={medicine.id}>
            {medicine.name} ({medicine.category}) {medicine.symptoms.join("、")}
          </li>
        ))}
      </ul>
    </div>
  );
}