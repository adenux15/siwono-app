import { returnPeminjaman } from "./src/app/peminjaman/actions";
async function test() {
  const result = await returnPeminjaman("194b74c1-379f-418e-a079-b83180432f03"); // I will use the ID from the test or fetch one
  console.log(result);
}
test();
