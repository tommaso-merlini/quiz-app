import { deleteMaterial } from "@/db/mutations";
import { getMaterialById } from "@/db/queries";
import { utapi } from "@/server/uploadthing";
import { revalidatePath } from "next/cache";

export async function deleteMaterialAndFile(materialID: number) {
  const material = await getMaterialById(materialID);
  await deleteMaterial(materialID);
  if (material.url) {
    await utapi.deleteFiles(material.url);
  }
  revalidatePath("/subjects");
}
