// 子コンポーネント: メモの中身（型）を先に定義する
interface HelloProps {
  title: string
}

function Hello({ title }: HelloProps) {
  return <div>{title}</div>
}
// データを配列として用意する
export const helloMessages = [
  { id: 1, title: 'ハロー' },
]

export default Hello