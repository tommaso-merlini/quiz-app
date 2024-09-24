import { db } from "@/db";
import { deleteMaterial } from "@/db/mutations";
import { getMaterialById } from "@/db/queries";
import { getFilenameFromUrl } from "@/utils/getFilenameFromUrl";
import { revalidatePath } from "next/cache";

export async function deleteMaterialAndFile(materialID: string) {
  const material = await getMaterialById(materialID);
  await db.transaction(async (tx) => {
    await deleteMaterial(materialID, tx);
    //TODO: delete file
    revalidatePath("/subjects");
  });
}
