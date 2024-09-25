"use server";

export async function getYswsAuthors(): Promise<any> {
  try {
    const response = await fetch(
      "https://api.airtable.com/v0/app3A5kJwYqxMLOgh/YSWS%20Authors",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        },
      },
    );
    const result = await response.json();
    const processedData = result.records.map((record) => ({
      name: record.fields.Name,
      totalGrantsThisMonth: record.fields["Total Grants This Month"] || 0,
      weightedGrantsThisMonth: record.fields["Weighted Grants This Month"] || 0,
      hoursThisMonth: record.fields["Hours This Month"] || 0,
      grantsQ12024: record.fields["Grants-Q1 2024"] || 0,
      grantsQ22024: record.fields["Grants-Q2 2024"] || 0,
      grants2024: record.fields["Grants-2024"] || 0,
    }));
    return processedData;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
