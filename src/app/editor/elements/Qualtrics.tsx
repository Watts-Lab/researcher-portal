export default function Qualtrics({ url, params, onSubmit }: { url: string, params: any, onSubmit: any }) {
  return (
    <div>
      <h1>Qualtrics</h1>
      <p> url: {url} </p>
      <p> params: {params} </p>
      <p> onSubmit: {onSubmit} </p>
    </div>
  );
}
