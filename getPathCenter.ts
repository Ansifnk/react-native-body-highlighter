interface BoundingBox {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}

function parseSVGPath(pathData: string): { type: string, values: number[] }[] {
    // Assuming path data is represented as a series of commands followed by coordinates
    const commands = pathData.match(/[a-df-z]|[\-+]?\d*\.?\d+(?:[eE][\-+]?\d+)?/gi);
    if (!commands) return [];

    const parsedPathData = [];
    let currentCommand = '';
    let currentValues: number[] = [];

    commands.forEach((token) => {
        if (/[a-df-z]/i.test(token)) {
            if (currentCommand !== '') {
                parsedPathData.push({ type: currentCommand, values: currentValues });
                currentValues = [];
            }
            currentCommand = token;
        } else {
            currentValues.push(parseFloat(token));
        }
    });

    if (currentCommand !== '') {
        parsedPathData.push({ type: currentCommand, values: currentValues });
    }

    return parsedPathData;
}

function calculateBoundingBox(pathData: { type: string, values: number[] }[]): BoundingBox {
    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    pathData.forEach((command) => {
        command.values.forEach((coord, index) => {
            if (index % 2 === 0) { // x-coordinate
                minX = Math.min(minX, coord);
                maxX = Math.max(maxX, coord);
            } else { // y-coordinate
                minY = Math.min(minY, coord);
                maxY = Math.max(maxY, coord);
            }
        });
    });

    return {
        minX: minX,
        minY: minY,
        maxX: maxX,
        maxY: maxY
    };
}

export function getSVGPathCenter(pathData: string): { x: number, y: number } {
    // Parse the path data
    const parsedPathData = parseSVGPath(pathData);

    // Calculate the bounding box
    const bbox = calculateBoundingBox(parsedPathData);

    // Calculate the center
    const centerX = (bbox.minX + bbox.maxX) / 2;
    const centerY = (bbox.minY + bbox.maxY) / 2;

    return { x: centerX, y: centerY };
}
