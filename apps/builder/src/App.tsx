import { useEffect, useState, useCallback, useRef } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  type Connection,
  type Edge,
  type Node,
  type NodeChange,
  type EdgeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { DndContext, useDraggable, useDroppable, type DragEndEvent } from '@dnd-kit/core';
import { loadModules } from '@toolbox/core';
import { createNode, validateConnection, type ModuleNodeData } from './flow';

const storageKey = 'builder-layout';

function Palette({ modules }: { modules: any[] }) {
  return (
    <div className="w-40 p-2 border-r overflow-y-auto">
      {modules.map((m) => (
        <DraggableModule key={m.name} module={m} />
      ))}
    </div>
  );
}

function DraggableModule({ module }: { module: any }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: module.name, data: module });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className="p-1 m-1 bg-gray-100 border cursor-grab">
      {module.name}
    </div>
  );
}

function Canvas() {
  const [nodes, setNodes] = useState<Node<ModuleNodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const rf = useReactFlow();
  const history = useRef<{ nodes: Node<ModuleNodeData>[]; edges: Edge[] }[]>([]);
  const future = useRef<typeof history.current>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { setNodeRef } = useDroppable({ id: 'canvas', data: null });

  // load from storage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const { nodes: n, edges: e } = JSON.parse(saved);
      setNodes(n);
      setEdges(e);
    }
  }, []);

  // persist
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ nodes, edges }));
  }, [nodes, edges]);

  // undo/redo handlers
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'z') {
        const prev = history.current.pop();
        if (prev) {
          future.current.push({ nodes, edges });
          setNodes(prev.nodes);
          setEdges(prev.edges);
        }
      }
      if (e.ctrlKey && e.key.toLowerCase() === 'y') {
        const next = future.current.pop();
        if (next) {
          history.current.push({ nodes, edges });
          setNodes(next.nodes);
          setEdges(next.edges);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [nodes, edges]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      history.current.push({ nodes, edges });
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [nodes, edges]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      history.current.push({ nodes, edges });
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [nodes, edges]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (validateConnection(nodes, connection)) {
        history.current.push({ nodes, edges });
        setEdges((eds) => addEdge(connection, eds));
      }
    },
    [nodes, edges]
  );

  const handleDragEnd = useCallback((e: DragEndEvent) => {
    if (e.over?.id === 'canvas' && e.active.data.current) {
      const module = e.active.data.current;
      const evt = e.activatorEvent as PointerEvent;
      const bounds = canvasRef.current?.getBoundingClientRect();
      const position = rf.project({
        x: evt.clientX - (bounds?.left ?? 0),
        y: evt.clientY - (bounds?.top ?? 0),
      });
      history.current.push({ nodes, edges });
      setNodes((nds) => [...nds, createNode(module, position)]);
    }
  }, [nodes, edges, rf]);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div
        ref={(el) => {
          canvasRef.current = el;
          setNodeRef(el);
        }}
        className="flex-1 h-screen"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </DndContext>
  );
}

export default function App() {
  const [modules, setModules] = useState<any[]>([]);
  useEffect(() => {
    loadModules().then(setModules).catch(console.error);
  }, []);

  return (
    <ReactFlowProvider>
      <div className="flex h-screen">
        <Palette modules={modules} />
        <Canvas />
      </div>
    </ReactFlowProvider>
  );
}
