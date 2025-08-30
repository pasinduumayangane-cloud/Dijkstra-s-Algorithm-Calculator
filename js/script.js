// Sample samplegraph data
const samplegraph = {
    A: { B: 4, C: 2 },
    B: { A: 4, C: 1, D: 5 },
    C: { A: 2, B: 1, D: 8, E: 10 },
    D: { B: 5, C: 8, E: 2, F: 6 },
    E: { C: 10, D: 2, F: 3 },
    F: { D: 6, E: 3, G: 4 },
    G: { F: 4 }
};

// algorithm implementation
function dijkstra(samplegraph, start, end) {
    const distances = {};
    const previous = {};
    const unvisited = new Set();
    
    // Initialize distances
    for (let node in samplegraph) {
        distances[node] = Infinity;
        unvisited.add(node);
    }
    distances[start] = 0;
    
    while (unvisited.size > 0) {
        // Find unvisited node with smallest distance
        let current = null;
        let smallestDistance = Infinity;
        // Find the unvisited node with the smallest distance
        for (let node of unvisited) {
            if (distances[node] < smallestDistance) {
                smallestDistance = distances[node];
                current = node;
            }
        }
        
        if (current === null || current === end) break;
        // Delete the current node from the unvisited set
        unvisited.delete(current);
        
        // Check neighbors
        for (let neighbor in samplegraph[current]) {
            if (unvisited.has(neighbor)) {
                const distance = distances[current] + samplegraph[current][neighbor];
                if (distance < distances[neighbor]) {
                    distances[neighbor] = distance;
                    previous[neighbor] = current;
                }
            }
        }
    }
    
    // Reconstruct path
    const path = [];
    let current = end;
    while (current !== undefined) {
        path.unshift(current);
        current = previous[current];
    }
    
    return {
        path: path,
        distance: distances[end]
    };
}

// Function to clear the selection
function clearSelection() {
    document.getElementById('from-node').value = '';
    document.getElementById('to-node').value = '';
    
    // Reset result display
    document.getElementById('path-result').innerHTML = '<p>Select nodes and click Calculate to see the result</p>';
    document.getElementById('distance-result').innerHTML = '';
}

// Function to calculate the path
function calculatePath() {
    const fromNode = document.getElementById('from-node').value;
    const toNode = document.getElementById('to-node').value;
    
    // Check if both From and To nodes are selected
    if (!fromNode || !toNode) {
        alert('Please select both From and To nodes');
        return;
    }
    
    // Check if From and To nodes are the same
    if (fromNode === toNode) {
        alert('From and To nodes cannot be the same');
        return;
    }
    
    // Calculate path using Dijkstra's algorithm
    const result = dijkstra(samplegraph, fromNode, toNode);
    
    if (result.distance === Infinity) {
        document.getElementById('path-result').innerHTML = '<p>No path found between the selected nodes</p>';
        document.getElementById('distance-result').innerHTML = '';
    } else {
        // Display the path
        const pathString = result.path.join(' → ');
        document.getElementById('path-result').innerHTML = `
            <p><strong>From Node "${fromNode}" to Node "${toNode}":</strong></p>
            <p style="font-size: 1.2rem; color: #1e3a8a; margin: 1rem 0;">${pathString}</p>
        `;
        
        // Display the distance
        document.getElementById('distance-result').innerHTML = `
            <p style="font-size: 1.3rem; color: #f97316; font-weight: 700;">
                Total Distance: ${result.distance}
            </p>
        `;
    }
}

// Add event listeners for better user experience
document.addEventListener('DOMContentLoaded', function() {
    // Add enter key support for dropdowns
    const nodeSelects = document.querySelectorAll('.node-select');
    nodeSelects.forEach(select => {
        select.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                calculatePath();
            }
        });
    });
    
    // Add focus styles
    nodeSelects.forEach(select => {
        select.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        select.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
    
    // Add smooth transitions for button interactions
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

// Export functions for global access
window.clearSelection = clearSelection;
window.calculatePath = calculatePath;
