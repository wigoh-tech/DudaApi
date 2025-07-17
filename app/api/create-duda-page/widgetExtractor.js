export function extractWidgetIds(flexStructure) {
  if (!flexStructure || !Array.isArray(flexStructure)) {
    return [];
  }
  
  const allWidgetIds = [];
  
  flexStructure.forEach((section, sectionIndex) => {
    const sectionWidgets = [];
    
    if (section.elements && typeof section.elements === 'object') {
      Object.entries(section.elements).forEach(([elementId, element]) => {
        // Check if this is a widget wrapper
        if (element.type === 'widget_wrapper' && element.data && element.data['data-widget-type']) {
          const widgetInfo = {
            id: elementId,
            name: element.name || 'Unknown Widget',
            widgetType: element.data['data-widget-type'],
            externalId: element.externalId || null,
            parentId: element.parentId || null,
            element: element // Include full element data if needed
          };
          
          sectionWidgets.push(widgetInfo);
        }
      });
    }
    
    if (sectionWidgets.length > 0) {
      allWidgetIds.push({
        sectionIndex: sectionIndex + 1,
        sectionId: section.id || `section-${sectionIndex + 1}`,
        rootContainerId: section.rootContainerId || null,
        widgets: sectionWidgets,
        totalWidgets: sectionWidgets.length
      });
    }
  });
  
  return allWidgetIds;
}

// Alternative function to get just the widget IDs as a flat array
export function getWidgetIdsFlat(flexStructure) {
  const extracted = extractWidgetIds(flexStructure);
  const flatIds = [];
  
  extracted.forEach((section) => {
    section.widgets.forEach((widget) => {
      flatIds.push(widget.id);
    });
  });
  
  return flatIds;
}

// Function to find a specific widget by ID
export function findWidgetById(flexStructure, widgetId) {
  const extracted = extractWidgetIds(flexStructure);
  
  for (const section of extracted) {
    const widget = section.widgets.find(w => w.id === widgetId);
    if (widget) {
      return {
        widget,
        section: {
          sectionIndex: section.sectionIndex,
          sectionId: section.sectionId
        }
      };
    }
  }
  
  return null;
}

// Function to get widgets by type
export function getWidgetsByType(flexStructure, widgetType) {
  const extracted = extractWidgetIds(flexStructure);
  const matchingWidgets = [];
  
  extracted.forEach((section) => {
    section.widgets.forEach((widget) => {
      if (widget.widgetType === widgetType) {
        matchingWidgets.push({
          ...widget,
          sectionIndex: section.sectionIndex,
          sectionId: section.sectionId
        });
      }
    });
  });
  
  return matchingWidgets;
}

// Match widget IDs with HTML content and extract inner div data
export function matchWidgetIdsWithHtmlContent(flexStructure, dmDivHtml) {
  if (!dmDivHtml) {
    return [];
  }

  const extractedWidgets = extractWidgetIds(flexStructure);
  const matchedResults = [];
  
  extractedWidgets.forEach((section) => {
    section.widgets.forEach((widget) => {
      // Check if the widget ID exists in the HTML content
      const idPattern = new RegExp(`id=['"]${widget.id}['"]`, 'i');
      const classPattern = new RegExp(`class=['"][^'"]*${widget.id}[^'"]*['"]`, 'i');
      const dataPattern = new RegExp(`data-[^=]*=['"][^'"]*${widget.id}[^'"]*['"]`, 'i');
      
      const isIdMatch = idPattern.test(dmDivHtml);
      const isClassMatch = classPattern.test(dmDivHtml);
      const isDataMatch = dataPattern.test(dmDivHtml);
      
      if (isIdMatch || isClassMatch || isDataMatch) {
        // Extract the inner div content for this widget
        const innerDivContent = extractInnerDivContent(dmDivHtml, widget.id);
        
        const matchResult = {
          widget: widget,
          section: {
            sectionIndex: section.sectionIndex,
            sectionId: section.sectionId
          },
          matchType: {
            id: isIdMatch,
            class: isClassMatch,
            data: isDataMatch
          },
          innerDivContent: innerDivContent,
          hasInnerContent: !!innerDivContent
        };
        
        matchedResults.push(matchResult);
      }
    });
  });
  
  return matchedResults;
}

// Extract inner div content for a specific widget ID
function extractInnerDivContent(htmlContent, widgetId) {
  try {
    const idRegex = new RegExp(`<[^>]*id=['"]${widgetId}['"][^>]*>(.*?)</[^>]*>`, 'is');
    let match = idRegex.exec(htmlContent);
    
    if (!match) {
      const classRegex = new RegExp(`<[^>]*class=['"][^'"]*${widgetId}[^'"]*['"][^>]*>(.*?)</[^>]*>`, 'is');
      match = classRegex.exec(htmlContent);
    }
    
    if (!match) {
      const dataRegex = new RegExp(`<[^>]*data-[^=]*=['"][^'"]*${widgetId}[^'"]*['"][^>]*>(.*?)</[^>]*>`, 'is');
      match = dataRegex.exec(htmlContent);
    }
    
    if (match && match[1]) {
      const innerContent = match[1].trim();
      return innerContent;
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

// Get detailed match information
export function getDetailedMatchInfo(flexStructure, dmDivHtml) {
  const matches = matchWidgetIdsWithHtmlContent(flexStructure, dmDivHtml);
  
  return {
    totalMatches: matches.length,
    matchesBySection: matches.reduce((acc, match) => {
      const sectionId = match.section.sectionId;
      if (!acc[sectionId]) {
        acc[sectionId] = [];
      }
      acc[sectionId].push(match);
      return acc;
    }, {}),
    matchesByType: matches.reduce((acc, match) => {
      const widgetType = match.widget.widgetType;
      if (!acc[widgetType]) {
        acc[widgetType] = [];
      }
      acc[widgetType].push(match);
      return acc;
    }, {}),
    matchesWithInnerContent: matches.filter(match => match.hasInnerContent),
    summary: {
      totalWidgets: getWidgetIdsFlat(flexStructure).length,
      matchedWidgets: matches.length,
      matchRate: matches.length > 0 ? ((matches.length / getWidgetIdsFlat(flexStructure).length) * 100).toFixed(2) + '%' : '0%'
    }
  };
}

// Match widget IDs from widgetIdsOnly with elementsWithIds
export function matchWidgetIdsWithElementsData(widgetIdsOnly, elementsWithIds) {
  if (!widgetIdsOnly || !elementsWithIds) {
    return {
      matches: [],
      summary: {
        totalWidgetIds: 0,
        totalElements: 0,
        matchedIds: 0,
        matchRate: '0%'
      }
    };
  }

  const matches = [];
  const allWidgetIds = [];
  
  // Collect all widget IDs from both primary and secondary batches
  if (widgetIdsOnly.fromInputBatches?.primary) {
    allWidgetIds.push(...widgetIdsOnly.fromInputBatches.primary.map(w => ({ ...w, source: 'primary' })));
  }
  
  if (widgetIdsOnly.fromInputBatches?.secondary) {
    allWidgetIds.push(...widgetIdsOnly.fromInputBatches.secondary.map(w => ({ ...w, source: 'secondary' })));
  }
  
  if (widgetIdsOnly.fromFlexStructure) {
    allWidgetIds.push(...widgetIdsOnly.fromFlexStructure.map(w => ({ ...w, source: 'flexStructure' })));
  }
  
  if (widgetIdsOnly.flatList) {
    allWidgetIds.push(...widgetIdsOnly.flatList.map(w => ({ ...w, source: 'flatList' })));
  }

  // Match each widget ID with elements
  allWidgetIds.forEach(widgetItem => {
    const widgetId = widgetItem.id;
    
    // Find matching elements
    const matchingElements = elementsWithIds.filter(element => {
      // Exact match
      if (element.id === widgetId) return true;
      
      // Partial match (element ID contains widget ID)
      if (element.id.includes(widgetId)) return true;
      
      // Reverse partial match (widget ID contains element ID)
      if (widgetId.includes(element.id)) return true;
      
      return false;
    });

    if (matchingElements.length > 0) {
      matchingElements.forEach(element => {
        const matchType = element.id === widgetId ? 'exact' : 'partial';
        
        const matchResult = {
          widgetId: widgetId,
          widgetSource: widgetItem.source,
          element: {
            id: element.id,
            tagName: element.tagName,
            text: element.text,
            html: element.html,
            outerHtml: element.outerHtml,
            attributes: element.attributes,
            hasInnerContent: element.hasInnerContent,
            sourceAttribute: element.sourceAttribute || 'id'
          },
          matchType: matchType,
          matchScore: calculateMatchScore(widgetId, element.id)
        };
        
        matches.push(matchResult);
      });
    }
  });

  // Calculate summary statistics
  const uniqueMatchedWidgetIds = [...new Set(matches.map(m => m.widgetId))];
  const matchRate = allWidgetIds.length > 0 ? 
    ((uniqueMatchedWidgetIds.length / allWidgetIds.length) * 100).toFixed(2) + '%' : '0%';

  const summary = {
    totalWidgetIds: allWidgetIds.length,
    totalElements: elementsWithIds.length,
    matchedIds: uniqueMatchedWidgetIds.length,
    totalMatches: matches.length,
    matchRate: matchRate,
    matchesBySource: {
      primary: matches.filter(m => m.widgetSource === 'primary').length,
      secondary: matches.filter(m => m.widgetSource === 'secondary').length,
      flexStructure: matches.filter(m => m.widgetSource === 'flexStructure').length,
      flatList: matches.filter(m => m.widgetSource === 'flatList').length
    },
    matchesByType: {
      exact: matches.filter(m => m.matchType === 'exact').length,
      partial: matches.filter(m => m.matchType === 'partial').length
    },
    matchesWithContent: matches.filter(m => m.element.hasInnerContent).length
  };

  return {
    matches: matches,
    summary: summary,
    matchedWidgetIds: uniqueMatchedWidgetIds
  };
}

// Helper function to calculate match score
function calculateMatchScore(widgetId, elementId) {
  if (widgetId === elementId) return 100;
  
  const longer = widgetId.length > elementId.length ? widgetId : elementId;
  const shorter = widgetId.length > elementId.length ? elementId : widgetId;
  
  if (longer.includes(shorter)) {
    return Math.floor((shorter.length / longer.length) * 90);
  }
  
  return 0;
}

// Get detailed content for matched widgets
export function getDetailedContentForMatches(matches) {
  const detailedMatches = matches.map(match => {
    const detailedMatch = {
      ...match,
      contentAnalysis: {
        hasText: !!match.element.text,
        hasHtml: !!match.element.html,
        textLength: match.element.text ? match.element.text.length : 0,
        htmlLength: match.element.html ? match.element.html.length : 0,
        textPreview: match.element.text ? match.element.text.substring(0, 100) : null,
        htmlPreview: match.element.html ? match.element.html.substring(0, 200) : null,
        isEmpty: !match.element.text && !match.element.html
      }
    };
    
    return detailedMatch;
  });
  
  return detailedMatches;
}

// Filter matches by criteria
export function filterMatches(matches, criteria = {}) {
  let filteredMatches = [...matches];
  
  if (criteria.hasContent) {
    filteredMatches = filteredMatches.filter(m => m.element.hasInnerContent);
  }
  
  if (criteria.matchType) {
    filteredMatches = filteredMatches.filter(m => m.matchType === criteria.matchType);
  }
  
  if (criteria.widgetSource) {
    filteredMatches = filteredMatches.filter(m => m.widgetSource === criteria.widgetSource);
  }
  
  if (criteria.minMatchScore) {
    filteredMatches = filteredMatches.filter(m => m.matchScore >= criteria.minMatchScore);
  }
  
  if (criteria.tagName) {
    filteredMatches = filteredMatches.filter(m => m.element.tagName === criteria.tagName);
  }
  
  return filteredMatches;
}