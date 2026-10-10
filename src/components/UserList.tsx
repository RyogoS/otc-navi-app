// import：外部から道具を持ってくる（輸入する）という意味です。
// { useState, useEffect }：Reactの中にあるたくさんの道具の中から、今回使いたい2つの道具を指定しています。
// useState：データを入れる「箱」を作る道具
// useEffect：画面が開いた時に「自動で注文（fetch）を出す」道具
// from "react"：これらの道具が「react という名前の道具箱（ライブラリ）」に入っていることを示しています。
import { useState, useEffect } from "react";

//   インターネットから届く「お友達データ」の形をTypeScriptに教えています。
// 「id は数字、name は文字が入ってくるよ！」という設計図です。
type User = {
  id: number;
  name: string;
};

export default function UserList() {

// users：お友達データが入る「透明な箱」です。
// setUsers：箱にデータを入れるための「魔法のボタン」です。
// <User[]>：この箱には「User のデータのグループ（配列）」を入れるよ、という指定です。
// ([])：最初は「空っぽの箱」からスタートします。
  const [users, setUsers] = useState<User[]>([]);

  //   useEffect：「画面が最初に開いた時だけ実行してね！」という合図です。
  useEffect(() => {

   // fetch(...)：指定したWebサイト（URL）へ「ユーザーデータをください！」と注文を出します。
    fetch("https://jsonplaceholder.typicode.com/users")

      // .then(response => response.json())：データが届いたら、JavaScriptで扱えるデータ（JSON形式）に解凍します。
      .then((response) => response.json())
    
      // .then(data => setUsers(data))：解凍できたデータを、作っておいた箱（setUsers）の中に送って保存します。
      .then((data: User[]) => setUsers(data));

  }, []); // ← ここに「}」が足りていませんでした！

  // HTMLの中身を返す
  return (
    <div>
      <h2>ユーザー一覧</h2>
      <ul>
        {/* users.map(...)：箱の中身を1人ずつ取り出すベルトコンベアです。
        key={user.id}：Reactが目印にするための「番号札（ID）」です。
        {user.name}：取り出したお友達の名前を画面に並べて見せています。 */}
        {users.map((user: User) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}