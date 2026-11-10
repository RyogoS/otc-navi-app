// React（リアクト）という道具箱から、2つの便利な道具を取り出す
// useState：データを入れておく「魔法の箱」を作る道具
// useEffect：画面が開いた時や、入力が変わった時に「自動で通信する」道具
import { useState, useEffect } from "react";

// インターネットから届く「お薬データ」の形をあらかじめ決めておく設計図
// 「idは数字、nameは文字、categoryは分類、symptomsは症状のリストが入るよ！」と教えています
type Medicine = {
  id: number; // お薬の識別番号
  name: string; // お薬の名前（例："〇〇頭痛薬"）
  category: string | null; // お薬の種類・分類（例："解熱鎮痛薬"）
  symptoms: string[]; // 効く症状のリスト（例：["頭痛", "熱"]）
};

// 症状ボタンのカテゴリ1つ分（カテゴリ名と、その中の症状）
type SymptomCategory = {
  category: string; // カテゴリボタンに出す名前（DBの category とは別物。例："外用鎮痛消炎薬"）
  symptoms: string[];  // 症状ボタン（例：["腰痛","肩こり"]）
}

// カテゴリボタン・症状ボタンに使うデータ
// ⚠️ 症状の文字は DB の symptoms と完全一致でないと検索されない（"痒み"などの表記ゆれに注意）
const categoryList: SymptomCategory[] = [
  { category: "外用鎮痛消炎薬", symptoms: ["腰痛", "肩こり", "筋肉痛", "関節痛"] },
  { category: "解熱鎮痛薬", symptoms: ["頭痛", "発熱", "生理痛", "歯痛"] },
  { category: "かぜ薬", symptoms: ["発熱", "頭痛", "のどの痛み", "せき", "たん", "鼻水", "鼻づまり", "くしゃみ", "悪寒"] },
  { category: "下痢・便秘薬", symptoms: ["下痢", "便秘", "整腸"] },
  { category: "胃腸薬", symptoms: ["胃もたれ", "胸やけ", "食べすぎ", "胃痛", "腹痛"] },
  { category: "塗り薬", symptoms: ["かゆみ", "虫さされ", "湿疹", "かぶれ", "じんましん", "水虫", "いんきんたむし"] },
  { category: "アレルギー用薬", symptoms: ["花粉症", "じんましん", "湿疹", "かゆみ", "鼻水", "くしゃみ"] },
  { category: "目薬", symptoms: ["花粉症", "目のかゆみ", "目の充血", "目の疲れ", "目のかすみ", "ものもらい", "結膜炎"] }
];

export default function MedicineList() {
  // ── 1. データをしまっておく3つの魔法の箱（state） ──

  // お薬の一覧データを入れる箱（最初は空っぽ [] からスタート）
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  // 検索欄に入力された文字（症状）を入れる箱（最初は文字なし "" からスタート）
  const [symptom, setSymptom] = useState<string>("");

  // 選択されたカテゴリを入れる箱
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // 通信トラブルが起きた時のエラーメッセージを入れる箱
  const [errorBox, setError] = useState<string>("");

  // 画面読み込み時点
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 打ち終わったあとの言葉で fetch する
  const [debouncedSymptom, setDebouncedSymptom] = useState<string>("");

  // ── 2. 文字入力欄の監視係 ──
  // ユーザーが検索欄に文字を入力するたびに呼び出されて、文字の箱（symptom）を新しく書き換えます
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSymptom(e.target.value); // 入力された最新の文字を保存！
  };

  // 選択症状を解除するクリアボタン
  const clearSelection = () => {
    setDebouncedSymptom("");
    setSymptom("");
    setSelectedCategory("");
  }

  // 選択されたカテゴリのデータを探す
  const selectedData = categoryList.find((oneCategory) => oneCategory.category === selectedCategory);

  // ── 3. お薬データの注文係（useEffect） ──
  // 検索欄の文字（symptom）が変わるたびに、バックエンド（サーバー）にお薬データを貰いに行くよ！
  useEffect(() => {

    setIsLoading(true);
    // 指定した症状（symptom）に合うお薬をサーバーに注文する（fetch）
    fetch(`http://localhost:3000/medicines?symptom=${debouncedSymptom.trim()}`)
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
  }, [debouncedSymptom]); // ← 打ち終わった文字（debouncedSymptom）が変わるたびに


  useEffect(() => {

    // 1. タイマーで予約して、予約番号を変数に入れる
    // 1秒（1000ミリ秒）後に実行
    const reservationNumber = setTimeout(() => {
      setDebouncedSymptom(symptom);
    }, 1000);

    // 2. 片付け係を return する（中身: その予約番号の予約を取り消す）
    return () => {
      clearTimeout(reservationNumber);
    }
  }, [symptom]);


  // ── 4. 画面（HTML）の見た目をつくる部分 ──
  return (
    <div>
      <h2>症状</h2>

      {/* カテゴリボタンを1つずつ順番に並べて表示する（map処理） */}
      {categoryList.map((oneCategory: SymptomCategory) => (
        <button key={oneCategory.category} onClick={() => {
          setSelectedCategory(oneCategory.category);
        }}
          style={{ backgroundColor: selectedCategory === oneCategory.category ? "lightblue" : undefined }}>
          {oneCategory.category}
        </button>
      ))}

      <div>
        {/* 症状ボタンを1つずつ順番に並べて表示する（map処理） */}
        {selectedData && selectedData.symptoms.map((option: string) => (
          <button key={option} onClick={() => {
            setSymptom(option);
            setDebouncedSymptom(option);
          }}
            style={{ backgroundColor: symptom === option ? "lightblue" : undefined }}>
            {option}
          </button>
        ))}
      </div>


      {/* 選択症状を解除するクリアボタン */}
      <button onClick={clearSelection}>
        クリア
      </button>

      {/* 検索用の入力欄 */}
      <input
        type="text"
        value={symptom}
        onChange={handleChange}
        placeholder="その他の症状"
      />

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
            {medicine.name} &nbsp;
            {medicine.category && <span>({medicine.category})&nbsp;</span>}
            {medicine.symptoms.join("、")}
          </li>
        ))}
      </ul>
    </div>
  );
}