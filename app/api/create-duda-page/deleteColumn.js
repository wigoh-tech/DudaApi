/**
 * Extracts child IDs that need to be deleted from parent groups with less than 2 children
 * @param {Object} structureComparison - The structure comparison object
 * @returns {Array} Array of child IDs to delete
 */
export function extractChildIdsToDelete(structureComparison) {
  const childIdsToDelete = [];

  if (
    !structureComparison ||
    !structureComparison.flexStructure ||
    !structureComparison.flexStructure.sections
  ) {
    console.log("❌ No flex structure sections found in structure comparison");
    return childIdsToDelete;
  }

  console.log("\n=== EXTRACTING CHILD IDS TO DELETE ===");

  structureComparison.flexStructure.sections.forEach(
    (section, sectionIndex) => {
      console.log(
        `Processing section ${sectionIndex + 1}: ${section.sectionId}`
      );

      if (section.parentGroups && Array.isArray(section.parentGroups)) {
        section.parentGroups.forEach((group, groupIndex) => {
          console.log(
            `  Group ${groupIndex + 1}: ${group.groupId} (${
              group.directChildCount
            } children)`
          );

          // Check if directChildCount is less than 2
          if (group.directChildCount < 2) {
            console.log(
              `    ✅ Group has ${group.directChildCount} children (less than 2)`
            );

            // Add all children of this group to deletion list
            if (group.children && Array.isArray(group.children)) {
              group.children.forEach((childId, childIndex) => {
                console.log(
                  `      Adding child ${
                    childIndex + 1
                  } to deletion list: ${childId}`
                );
                childIdsToDelete.push({
                  sectionId: section.sectionId,
                  sectionIndex: sectionIndex + 1,
                  groupId: group.groupId,
                  parentId: group.parentId,
                  childId: childId,
                  childIndex: childIndex,
                  groupChildCount: group.directChildCount,
                  deletionReason: `Group has ${group.directChildCount} children (less than 2)`,
                });
              });
            }
          } else {
            console.log(
              `    ❌ Group has ${group.directChildCount} children (2 or more, no deletion needed)`
            );
          }
        });
      }
    }
  );

  console.log(`\n=== EXTRACTION SUMMARY ===`);
  console.log(`Total child IDs to delete: ${childIdsToDelete.length}`);
  console.log(
    `Child IDs:`,
    childIdsToDelete.map((item) => item.childId)
  );

  return childIdsToDelete;
}

/**
 * Extracts child IDs from parentGroupDetails comparison
 * @param {Object} structureComparison - The structure comparison object
 * @returns {Array} Array of child IDs to delete based on primary vs flex comparison
 */
export function extractChildIdsFromParentGroupDetails(structureComparison) {
  const childIdsToDelete = [];

  if (!structureComparison || !structureComparison.parentGroupDetails) {
    console.log("❌ No parent group details found in structure comparison");
    return childIdsToDelete;
  }

  console.log("\n=== EXTRACTING CHILD IDS FROM PARENT GROUP DETAILS ===");
  console.log(
    "Parent Group Details:",
    JSON.stringify(structureComparison.parentGroupDetails, null, 2)
  );

  structureComparison.parentGroupDetails.forEach((detail, index) => {
    // Only show processing details for groups with less than 2 primary children
    if (detail.primaryDirectChildren < 2) {
      console.log(`Processing parent group detail ${index + 1}:`);

      // Use flexGroupId as the primary identifier since that's what we need to match with flex structure
      const groupId =
        detail.flexGroupId ||
        detail.groupId ||
        detail.id ||
        detail.parentId ||
        detail.key;
      console.log(`  Group ID: ${groupId}`);
      console.log(`  Primary Direct Children: ${detail.primaryDirectChildren}`);
      console.log(`  Flex Direct Children: ${detail.flexDirectChildren}`);
      console.log(`  Full detail object:`, JSON.stringify(detail, null, 2));

      console.log(
        `    ✅ Primary has ${detail.primaryDirectChildren} children (less than 2)`
      );

      if (groupId) {
        console.log(`    Using groupId: ${groupId}`);

        // Find the corresponding flex structure group and get its children
        if (
          structureComparison.flexStructure &&
          structureComparison.flexStructure.sections
        ) {
          let foundMatch = false;

          structureComparison.flexStructure.sections.forEach((section) => {
            if (section.parentGroups) {
              section.parentGroups.forEach((group) => {
                if (group.groupId === groupId) {
                  foundMatch = true;
                  console.log(
                    `    Found matching group in flex structure: ${group.groupId}`
                  );
                  console.log(
                    `    Flex group has ${group.directChildCount} children`
                  );
                  console.log(`    Children array:`, group.children);

                  // Add children to deletion list based on the difference
                  if (group.children && Array.isArray(group.children)) {
                    // If primary has 0 children, delete all flex children
                    // If primary has 1 child, delete from the second child onwards
                    const childrenToDelete = group.children.slice(
                      detail.primaryDirectChildren
                    );

                    console.log(
                      `    Children to delete (starting from index ${detail.primaryDirectChildren}):`,
                      childrenToDelete
                    );

                    childrenToDelete.forEach((childId, childIndex) => {
                      console.log(
                        `      Adding child to deletion list: ${childId}`
                      );
                      childIdsToDelete.push({
                        sectionId: section.sectionId,
                        sectionIndex: section.sectionIndex,
                        groupId: group.groupId,
                        parentId: group.parentId,
                        childId: childId,
                        childIndex: detail.primaryDirectChildren + childIndex,
                        groupChildCount: group.directChildCount,
                        primaryChildCount: detail.primaryDirectChildren,
                        flexChildCount: detail.flexDirectChildren,
                        deletionReason: `Primary has ${detail.primaryDirectChildren} children, flex has ${detail.flexDirectChildren} children`,
                      });
                    });
                  }
                }
              });
            }
          });

          if (!foundMatch) {
            console.log(
              `    ❌ No matching group found in flex structure for groupId: ${groupId}`
            );
          }
        }
      } else {
        console.log(`    ❌ Could not determine groupId from detail object`);
      }
    }
    // Skip showing details for groups with 2 or more children
  });

  console.log(`\n=== PARENT GROUP DETAILS EXTRACTION SUMMARY ===`);
  console.log(`Total child IDs to delete: ${childIdsToDelete.length}`);
  console.log(
    `Child IDs:`,
    childIdsToDelete.map((item) => item.childId)
  );

  return childIdsToDelete;
}

/**
 * Enhanced function to extract child IDs by directly matching parent group details with flex structure
 * @param {Object} structureComparison - The structure comparison object
 * @returns {Array} Array of child IDs to delete
 */
export function extractChildIdsFromStructureComparison(structureComparison) {
  const childIdsToDelete = [];

  if (
    !structureComparison ||
    !structureComparison.parentGroupDetails ||
    !structureComparison.flexStructure
  ) {
    console.log("❌ Missing required structure comparison data");
    return childIdsToDelete;
  }

  console.log("\n=== ENHANCED EXTRACTION FROM STRUCTURE COMPARISON ===");

  // Create a map of all groups from flex structure for easy lookup
  const flexGroupsMap = new Map();

  if (structureComparison.flexStructure.sections) {
    structureComparison.flexStructure.sections.forEach((section) => {
      if (section.parentGroups) {
        section.parentGroups.forEach((group) => {
          flexGroupsMap.set(group.groupId, {
            ...group,
            sectionId: section.sectionId,
            sectionIndex: section.sectionIndex,
          });
        });
      }
    });
  }

  console.log(`Found ${flexGroupsMap.size} groups in flex structure`);
  console.log(`Flex groups:`, Array.from(flexGroupsMap.keys()));

  // Process each parent group detail
  structureComparison.parentGroupDetails.forEach((detail, index) => {
    // Only process and show details for groups with less than 2 primary children
    if (detail.primaryDirectChildren < 2) {
      console.log(`\nProcessing parent group detail ${index + 1}:`);
      console.log(`Detail object:`, JSON.stringify(detail, null, 2));

      // Extract groupId from the detail object - use flexGroupId as that's what we need to match
      let groupId = detail.flexGroupId || detail.groupId || detail.id;

      console.log(`  Extracted Group ID: ${groupId}`);
      console.log(`  Primary Direct Children: ${detail.primaryDirectChildren}`);
      console.log(`  Flex Direct Children: ${detail.flexDirectChildren}`);

      console.log(
        `    ✅ Primary has ${detail.primaryDirectChildren} children (less than 2)`
      );

      // Find the corresponding flex group
      const flexGroup = flexGroupsMap.get(groupId);

      if (flexGroup) {
        console.log(`    Found matching flex group: ${flexGroup.groupId}`);
        console.log(`    Flex group children:`, flexGroup.children);
        console.log(
          `    Flex group child count: ${flexGroup.directChildCount}`
        );

        if (flexGroup.children && Array.isArray(flexGroup.children)) {
          // Delete children starting from the primaryDirectChildren index
          const childrenToDelete = flexGroup.children.slice(
            detail.primaryDirectChildren
          );

          console.log(
            `    Children to delete (from index ${detail.primaryDirectChildren}):`,
            childrenToDelete
          );

          childrenToDelete.forEach((childId, childIndex) => {
            console.log(`      Adding child to deletion list: ${childId}`);
            childIdsToDelete.push({
              sectionId: flexGroup.sectionId,
              sectionIndex: flexGroup.sectionIndex,
              groupId: flexGroup.groupId,
              parentId: flexGroup.parentId,
              childId: childId,
              childIndex: detail.primaryDirectChildren + childIndex,
              groupChildCount: flexGroup.directChildCount,
              primaryChildCount: detail.primaryDirectChildren,
              flexChildCount: detail.flexDirectChildren,
              deletionReason: `Primary has ${detail.primaryDirectChildren} children, flex has ${detail.flexDirectChildren} children - deleting excess children`,
            });
          });
        }
      } else {
        console.log(
          `    ❌ No matching flex group found for groupId: ${groupId}`
        );
        console.log(
          `    Available flex group IDs:`,
          Array.from(flexGroupsMap.keys())
        );
      }
    }
    // Skip processing groups with 2 or more primary children
  });

  console.log(`\n=== ENHANCED EXTRACTION SUMMARY ===`);
  console.log(`Total child IDs to delete: ${childIdsToDelete.length}`);
  console.log(
    `Child IDs:`,
    childIdsToDelete.map((item) => item.childId)
  );

  return childIdsToDelete;
}

/**
 * Executes deletion of child elements using the provided fetch data
 * @param {Array} childIdsToDelete - Array of child objects to delete
 * @param {string} pageId - The page ID for the deletion API
 * @param {string} uuid - The uuid for the deletion API
 * @param {string} elementId - The Element ID for the deletion API
 * @returns {Object} Deletion results
 */
export async function executeChildDeletions(
  childIdsToDelete,
  pageId,
  uuid,
  elementId
) {
  console.log("\n=== EXECUTING CHILD DELETIONS ===");
  console.log(`Total deletions to execute: ${childIdsToDelete.length}`);
  console.log(`Page ID: ${pageId}`);
  console.log(`UUID: ${uuid}`);
  console.log(`Element ID: ${elementId}`);

  const deletionResults = [];

  for (let i = 0; i < childIdsToDelete.length; i++) {
    const childToDelete = childIdsToDelete[i];
    console.log(`\n--- Deleting child ${i + 1}/${childIdsToDelete.length} ---`);
    console.log(`Child ID: ${childToDelete.childId}`);
    console.log(`Group ID: ${childToDelete.groupId}`);
    console.log(`UUID ID: ${uuid}`);
    console.log(`Element ID: ${elementId}`);
    console.log(`Section ID: ${childToDelete.sectionId}`);
    console.log(`Reason: ${childToDelete.deletionReason}`);

    const deletionResult = {
      childId: childToDelete.childId,
      groupId: childToDelete.groupId,
      sectionId: childToDelete.sectionId,
      uuid: uuid,
      elementId: elementId,
      success: false,
      error: null,
      response: null,
      deletionReason: childToDelete.deletionReason,
    };

    try {
      // Use sectionId as elementId if elementId is undefined or not provided
      const actualElementId = elementId || childToDelete.sectionId;

      // Construct the deletion URL
      const deleteUrl = `https://my.duda.co/api/uis/pages/${uuid}/flexStructure/${actualElementId}/element/${childToDelete.childId}?dontSaveHistory=true`;

      console.log(
        `Using Element ID: ${actualElementId} (original elementId: ${elementId}, sectionId: ${childToDelete.sectionId})`
      );

      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9",
          baggage:
            "sentry-environment=direct,sentry-release=production_5644,sentry-public_key=0d2f170da99ddd8d3befc10a7f4ddd29,sentry-trace_id=a2e21d4e00584b8598eae2338199056b,sentry-sampled=false,sentry-sample_rand=0.7043784013969191,sentry-sample_rate=0.1",
          "content-type": "application/json",
          dm_loc: "/home/site/41e002a2/duda4be24069",
          origin: "https://my.duda.co",
          priority: "u=1, i",
          referer: "https://my.duda.co/home/site/41e002a2/duda4be24069",
          "sec-ch-ua":
            '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Linux"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "sentry-trace": "a2e21d4e00584b8598eae2338199056b-9ba238607469622a-0",
          "user-agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
          "x-requested-with": "XMLHttpRequest",
          cookie:
            "_gd_visitor=40d0bd8f-b2b9-4fcf-86ea-2accc484ed78; language=en; landingPage=/login; _fbp=fb.1.1752547231596.871167907101487908; hubspotutk=9af6036ce59b5aa15aa544ef46b86533; account_uuid=41ea951a2a304fa38d59162280dae36b; dm_ac_tokens=ZLDMCMDy3OL75EfI6RdDAtbVp0BGN0Sz7Ls8wxnYUOi4ozbZmsPI5A==; __zlcmid=1RsneD9izLkntAc; __adroll_fpc=089d3b7c8c30a01d5551acf4c8db604c-1752719288427; __ar_v4=LVLOIN3JF5FT3CD5CBETI7%3A20250818%3A2%7C5PYFNWAESVGU5BU47WLRIT%3A20250818%3A2%7CNK6BCP2ZPJC2BEAS7JMXC2%3A20250818%3A2; dm_ac_tokens=ZLDMCMDy3OL75EfI6RdDAtbVp0BGN0Sz7Ls8wxnYUOi4ozbZmsPI5A==; _dm_ac_tokens=ZLDMCMDy3OL75EfI6RdDAtbVp0BGN0Sz7Ls8wxnYUOi4ozbZmsPI5A==; first_conversion_medium_touchpoints=null%3B%20referral%3B%20referral; first_conversion_campaign_touchpoints=null%3B%20null%3B%20null; first_conversion_term_touchpoints=null%3B%20null%3B%20null; first_conversion_content_touchpoints=null%3B%20null%3B%20null; _ga_9WXYK3PMB6=GS2.1.s1756184680$o1$g0$t1756184685$j55$l0$h0; AWSALBTG=YQuvdWvYOk5O+BlITPK77RGHQb8y0GDB4kDtpHT2NfT5sEInyUhZRPOOEXoNwbXrLC4Vt4iWOIGyUnCvVYki8fDz40j/hFKmZV1aXe1w996dhILpX64QCHcxwM+BaecUhWlMwrgJ828WmoLQNasxmvcPLy+GUjrebKWqb+nODnKzxJeDItQ=; _gid=GA1.2.2014990144.1756348807; __hssrc=1; IR_gbd=duda.co; _gd_session=5f01d825-6c06-4051-8746-c5c1ff981ff6; deviceView=desktop; first_conversion_source_touchpoints=direct%3B%20127.0.0.1%3B%20claude.; isFirstSessionVisit=false; cebs=1; _ce.clock_data=46%2C49.37.222.205%2C1%2C6ffa570f521e87e65c529e15a5aaac67%2CChrome%2CIN; _dm_remember_me=ZlNaUVA4T3djOHR3c1dYcEdON3kwUSUzRCUzRDo3RnNFMjRoVjlydUgxWjdPMklWYW5BJTNEJTNE; cebsp_=2; _ce.s=v~8371c5812a5a58ab73d92049be54c44bf1c24111~lcw~1756368199998~vir~returning~lva~1756368196156~vpv~5~v11ls~7445b440-83e5-11f0-8d62-8547177dbc15~v11.cs~268877~v11.s~7445b440-83e5-11f0-8d62-8547177dbc15~v11.vs~8371c5812a5a58ab73d92049be54c44bf1c24111~v11.fsvd~eyJ1cmwiOiJkdWRhLmNvL2xvZ2luIiwicmVmIjoiaHR0cHM6Ly9teS5kdWRhLmNvLyIsInV0bSI6W119~v11.sla~1756368197003~gtrk.la~mev4a3cu~lcw~1756368203646; _conv_r=s%3Awww.duda.co*m%3Areferral*t%3A*c%3A; __hstc=244318362.9af6036ce59b5aa15aa544ef46b86533.1752547233092.1756372016075.1756376458580.168; _dm_account=%7B%22name%22%3A%22misham%40wigoh.ai%22%2C%22uuid%22%3A%2241ea951a2a304fa38d59162280dae36b%22%2C%22gaType%22%3A%22SMB%22%2C%22lastLogin%22%3A1756376453000%7D; JSESSIONID=07EE7998A31C15EE0CD61470159DCE2A; _gcl_au=1.1.186818603.1752547231; _ga=GA1.1.b4287402-ca49-4b83-901e-0a7c52f82c1a; _conv_v=vi%3A1*sc%3A208*cs%3A1756376459*fs%3A1752547229*pv%3A601*exp%3A%7B100254142.%7Bv.1002832145-g.%7B%7D%7D%7D*seg%3A%7B%7D*ps%3A1756372017; _conv_s=si%3A208*sh%3A1756376459063-0.6210584439652719*pv%3A3; _uetsid=55d25e5083b811f0bd6e570fa1003a5d; _uetvid=24df0c103b8511f0b71eb52d29352553; IR_13628=1756377117656%7C0%7C1756377117656%7C%7C; __hssc=244318362.3.1756376458580; _dm_se_token_me=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2NvdW50VXVpZCI6IjQxZWE5NTFhMmEzMDRmYTM4ZDU5MTYyMjgwZGFlMzZiIiwiYWNjb3VudE5hbWUiOiJtaXNoYW1Ad2lnb2guYWkiLCJjcmVhdGlvblRpbWUiOjE3NTYzNzcxMzQ4NjYsImV4cCI6MTc1NjM3OTUzNH0.WFtN7EHY0JTZXpsOGqtZwUP2hPdqG1YIeV49dx_oE68; _ga_GFZCS4CS4Q=GS2.1.s1756348817$o35$g1$t1756377306$j60$l0$h0; AWSALB=q65NK0GKc0jx1YIvWW36bipisCfXoNfL13lWUXwGRXRIPUMMF3pw/vN+y06c3EzRpHL4SznJWo9GznUI8I/T1vXdCH4f4mUgYFQis83ajUwhbSgBQMNUxJ5zc+pk",
        },
      });

      const responseData = await response.text();

      if (response.ok) {
        console.log(`✅ Successfully deleted child: ${childToDelete.childId}`);
        deletionResult.success = true;
        deletionResult.response = responseData;
      } else {
        console.log(`❌ Failed to delete child: ${childToDelete.childId}`);
        console.log(`Response status: ${response.status}`);
        console.log(`Response data: ${responseData}`);
        deletionResult.error = `HTTP ${response.status}: ${responseData}`;
      }
    } catch (error) {
      console.error(`❌ Error deleting child ${childToDelete.childId}:`, error);
      deletionResult.error = error.message;
    }

    deletionResults.push(deletionResult);

    // Add delay between deletions
    if (i < childIdsToDelete.length - 1) {
      console.log("Waiting 1 second before next deletion...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log("\n=== DELETION SUMMARY ===");
  console.log(`Total deletions attempted: ${deletionResults.length}`);
  console.log(
    `Successful deletions: ${deletionResults.filter((r) => r.success).length}`
  );
  console.log(
    `Failed deletions: ${deletionResults.filter((r) => !r.success).length}`
  );

  return {
    success: deletionResults.some((r) => r.success),
    totalAttempted: deletionResults.length,
    totalSuccessful: deletionResults.filter((r) => r.success).length,
    totalFailed: deletionResults.filter((r) => !r.success).length,
    deletionResults: deletionResults,
    summary: {
      successfulDeletions: deletionResults
        .filter((r) => r.success)
        .map((r) => r.childId),
      failedDeletions: deletionResults
        .filter((r) => !r.success)
        .map((r) => ({
          childId: r.childId,
          error: r.error,
        })),
    },
  };
}

/**
 * Main function to handle the complete deletion process
 * @param {Object} structureComparison - The structure comparison object
 * @param {string} pageId - The page ID for the deletion API
 * @param {string} uuid - The uuid for the deletion API
 * @param {string} elementId - The element ID for the deletion API
 * @returns {Object} Complete deletion results
 */
export async function handleChildDeletions(
  structureComparison,
  pageId,
  uuid,
  elementId
) {
  console.log("\n=== STARTING CHILD DELETION PROCESS ===");

  // Extract child IDs using all available methods
  const childIdsFromFlexStructure =
    extractChildIdsToDelete(structureComparison);
  const childIdsFromParentGroupDetails =
    extractChildIdsFromParentGroupDetails(structureComparison);
  const childIdsFromEnhancedExtraction =
    extractChildIdsFromStructureComparison(structureComparison);

  // Combine and deduplicate child IDs
  const allChildIds = [
    ...childIdsFromFlexStructure,
    ...childIdsFromParentGroupDetails,
    ...childIdsFromEnhancedExtraction,
  ];

  const uniqueChildIds = allChildIds.filter(
    (child, index, self) =>
      index === self.findIndex((c) => c.childId === child.childId)
  );

  console.log(`\nCombined extraction results:`);
  console.log(`From flex structure: ${childIdsFromFlexStructure.length}`);
  console.log(
    `From parent group details: ${childIdsFromParentGroupDetails.length}`
  );
  console.log(
    `From enhanced extraction: ${childIdsFromEnhancedExtraction.length}`
  );
  console.log(`Total unique child IDs: ${uniqueChildIds.length}`);

  if (uniqueChildIds.length === 0) {
    console.log("✅ No child IDs to delete");
    return {
      success: true,
      message: "No child IDs to delete",
      totalAttempted: 0,
      totalSuccessful: 0,
      totalFailed: 0,
      deletionResults: [],
      extractionResults: {
        fromFlexStructure: childIdsFromFlexStructure,
        fromParentGroupDetails: childIdsFromParentGroupDetails,
        fromEnhancedExtraction: childIdsFromEnhancedExtraction,
        combinedUnique: uniqueChildIds,
      },
    };
  }

  // Execute deletions - NOW PASS elementId AS 4TH PARAMETER
  const deletionResults = await executeChildDeletions(
    uniqueChildIds,
    pageId,
    uuid,
    elementId
  );

  return {
    ...deletionResults,
    extractionResults: {
      fromFlexStructure: childIdsFromFlexStructure,
      fromParentGroupDetails: childIdsFromParentGroupDetails,
      fromEnhancedExtraction: childIdsFromEnhancedExtraction,
      combinedUnique: uniqueChildIds,
    },
  };
}
