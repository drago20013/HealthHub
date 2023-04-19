import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Add logic for POST request
    // ...
  } else if (req.method === "GET") {
    try {
      const { id } = req.query;
      console.log(Number(id));
      const results = await prisma.physicalExamination.findMany({
        where: {
          visit_id: Number(id),
        },
        include: {
          examinationDictionary: true,
        },
      });
      console.log(results);
      if (results.length !== 0) {
        return res.status(200).json(results);
      } else {
        return res
          .status(400)
          .json({ message: "No laboratory examinations found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve physical examinations",
      });
    }
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Invalid request method" });
  }
}
