import { db } from "@/db";
import { deleteMaterial } from "@/db/mutations";
import { getMaterialById } from "@/db/queries";
import { utapi } from "@/server/uploadthing";
import { getFilenameFromUrl } from "@/utils/getFilenameFromUrl";
import { revalidatePath } from "next/cache";

export async function deleteMaterialAndFile(materialID: number) {
  const material = await getMaterialById(materialID);
  await db.transaction(async (tx) => {
    await deleteMaterial(materialID, tx);
    if (material.url) {
      const filename = getFilenameFromUrl(material.url);
      await utapi.deleteFiles(filename);
    }
    revalidatePath("/subjects");
  });
}
