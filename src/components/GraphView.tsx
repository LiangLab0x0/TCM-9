import React, { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Network, Leaf, Beaker, BookOpen, Package, Pill } from 'lucide-react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Handle,
  Position,
  NodeProps,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useNewAppStore } from '../store';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

// 节点颜色配置
const nodeColors = {
  material: { bg: '#dcfce7', border: '#86efac', icon: '#22c55e' },
  slice: { bg: '#dbeafe', border: '#93c5fd', icon: '#3b82f6' },
  formula: { bg: '#fef3c7', border: '#fcd34d', icon: '#f59e0b' },
  granule: { bg: '#ede9fe', border: '#c7d2fe', icon: '#8b5cf6' },
  medicine: { bg: '#fee2e2', border: '#fca5a5', icon: '#ef4444' },
};

// 材料节点组件
function MaterialNode({ data }: NodeProps<any>) {
  const colors = nodeColors.material;
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-opacity-90 min-w-[150px]`}
      style={{ backgroundColor: colors.bg, borderColor: colors.border }}
    >
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center gap-2">
        <Leaf className="w-4 h-4" style={{ color: colors.icon }} />
        <div>
          <div className="font-semibold text-sm">{data.label}</div>
          <div className="text-xs text-gray-600">{data.qi}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

// 饮片节点组件
function SliceNode({ data }: NodeProps<any>) {
  const colors = nodeColors.slice;
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-opacity-90 min-w-[150px]`}
      style={{ backgroundColor: colors.bg, borderColor: colors.border }}
    >
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center gap-2">
        <Beaker className="w-4 h-4" style={{ color: colors.icon }} />
        <div>
          <div className="font-semibold text-sm">{data.label}</div>
          <div className="text-xs text-gray-600">{data.method}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

// 方剂节点组件
function FormulaNode({ data }: NodeProps<any>) {
  const colors = nodeColors.formula;
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-opacity-90 min-w-[180px]`}
      style={{ backgroundColor: colors.bg, borderColor: colors.border }}
    >
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4" style={{ color: colors.icon }} />
        <div>
          <div className="font-semibold text-sm">{data.label}</div>
          <div className="text-xs text-gray-600">{data.category}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

// 颗粒节点组件
function GranuleNode({ data }: NodeProps<any>) {
  const colors = nodeColors.granule;
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-opacity-90 min-w-[150px]`}
      style={{ backgroundColor: colors.bg, borderColor: colors.border }}
    >
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center gap-2">
        <Package className="w-4 h-4" style={{ color: colors.icon }} />
        <div>
          <div className="font-semibold text-sm">{data.label}</div>
          <div className="text-xs text-gray-600">配方颗粒</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

// 成药节点组件
function MedicineNode({ data }: NodeProps<any>) {
  const colors = nodeColors.medicine;
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-opacity-90 min-w-[150px]`}
      style={{ backgroundColor: colors.bg, borderColor: colors.border }}
    >
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center gap-2">
        <Pill className="w-4 h-4" style={{ color: colors.icon }} />
        <div>
          <div className="font-semibold text-sm">{data.label}</div>
          <div className="text-xs text-gray-600">{data.form}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

// 节点类型定义
const nodeTypes = {
  material: MaterialNode,
  slice: SliceNode,
  formula: FormulaNode,
  granule: GranuleNode,
  medicine: MedicineNode,
};

export const GraphView: React.FC = () => {
  const { 
    materials, 
    slices, 
    formulas, 
    setCurrentView,
    setSelectedMaterial,
    setSelectedFormula,
    setCurrentEntityType
  } = useNewAppStore();
  
  const [showMaterials, setShowMaterials] = useState(true);
  const [showSlices, setShowSlices] = useState(true);
  const [showFormulas, setShowFormulas] = useState(true);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // 生成节点和边
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const nodeY = 0;
    const xOffsets = {
      material: 0,
      slice: 300,
      formula: 600,
      granule: 900,
      medicine: 1200
    };

    // 材料节点
    if (showMaterials) {
      materials.slice(0, 10).forEach((material, i) => {
        nodes.push({
          id: `material-${material.id}`,
          type: 'material',
          position: { x: xOffsets.material, y: i * 100 },
          data: { 
            label: material.names.cn,
            qi: material.qi,
            entity: material
          }
        });
      });
    }

    // 饮片节点
    if (showSlices) {
      slices.slice(0, 15).forEach((slice, i) => {
        // 获取对应的材料名称
        const material = materials.find(m => m.id === slice.materialId);
        nodes.push({
          id: `slice-${slice.id}`,
          type: 'slice',
          position: { x: xOffsets.slice, y: i * 80 },
          data: { 
            label: material ? `${material.names.cn}（${slice.processing.method}）` : slice.processing.method,
            method: slice.processing.method,
            entity: slice
          }
        });

        // 材料到饮片的边
        if (showMaterials) {
          edges.push({
            id: `material-${slice.materialId}-to-slice-${slice.id}`,
            source: `material-${slice.materialId}`,
            target: `slice-${slice.id}`,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#86efac' }
          });
        }
      });
    }

    // 方剂节点
    if (showFormulas) {
      formulas.slice(0, 8).forEach((formula, i) => {
        nodes.push({
          id: `formula-${formula.id}`,
          type: 'formula',
          position: { x: xOffsets.formula, y: i * 120 },
          data: { 
            label: formula.name,
            category: formula.category,
            entity: formula
          }
        });

        // 饮片到方剂的边
        if (showSlices) {
          formula.components.forEach(comp => {
            edges.push({
              id: `slice-${comp.sliceId}-to-formula-${formula.id}`,
              source: `slice-${comp.sliceId}`,
              target: `formula-${formula.id}`,
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#93c5fd' },
              label: `${comp.weight.value}${comp.weight.unit}`,
              labelStyle: { fontSize: 10 }
            });
          });
        }
      });
    }

    // 示例：添加一些颗粒和成药节点
    nodes.push({
      id: 'granule-1',
      type: 'granule',
      position: { x: xOffsets.granule, y: 100 },
      data: { label: '配方颗粒示例' }
    });

    nodes.push({
      id: 'medicine-1',
      type: 'medicine',
      position: { x: xOffsets.medicine, y: 100 },
      data: { label: '中成药示例', form: '片剂' }
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [materials, slices, formulas, showMaterials, showSlices, showFormulas]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    
    // 根据节点类型导航到详情页
    if (node.data.entity) {
      if (node.type === 'material') {
        setSelectedMaterial(node.data.entity);
        setCurrentEntityType('material');
        setCurrentView('detail');
      } else if (node.type === 'formula') {
        setSelectedFormula(node.data.entity);
        setCurrentEntityType('formula');
        setCurrentView('detail');
      }
      // 可以继续添加其他类型的处理
    }
  }, [setSelectedMaterial, setSelectedFormula, setCurrentEntityType, setCurrentView]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 返回按钮 */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-6 left-6 z-20 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
        onClick={() => setCurrentView('gallery')}
      >
        <ArrowLeft className="w-6 h-6 text-gray-700" />
      </motion.button>

      {/* 标题 */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Network className="w-6 h-6" />
          中医药知识图谱
        </h1>
      </div>

      {/* React Flow 容器 */}
      <div className="w-full h-screen">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50"
        >
          <Controls />
          <MiniMap 
            nodeColor={(node) => {
              const type = node.type as keyof typeof nodeColors;
              return nodeColors[type]?.bg || '#e5e7eb';
            }}
          />
          <Background variant="dots" gap={12} size={1} />
          
          {/* 控制面板 */}
          <Panel position="top-right" className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="font-semibold mb-3">显示层级</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showMaterials}
                  onChange={(e) => setShowMaterials(e.target.checked)}
                  className="rounded"
                />
                <Leaf className="w-4 h-4 text-green-500" />
                <span className="text-sm">药材</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showSlices}
                  onChange={(e) => setShowSlices(e.target.checked)}
                  className="rounded"
                />
                <Beaker className="w-4 h-4 text-blue-500" />
                <span className="text-sm">饮片</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showFormulas}
                  onChange={(e) => setShowFormulas(e.target.checked)}
                  className="rounded"
                />
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span className="text-sm">方剂</span>
              </label>
            </div>
          </Panel>

          {/* 图例 */}
          <Panel position="bottom-left" className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="font-semibold mb-3">图例</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: nodeColors.material.bg }} />
                <span>药材（原材料）</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: nodeColors.slice.bg }} />
                <span>饮片（炮制品）</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: nodeColors.formula.bg }} />
                <span>方剂（配方）</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: nodeColors.granule.bg }} />
                <span>配方颗粒</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: nodeColors.medicine.bg }} />
                <span>中成药</span>
              </div>
            </div>
          </Panel>

          {/* 选中节点信息 */}
          {selectedNode && (
            <Panel position="bottom-right" className="bg-white p-4 rounded-lg shadow-lg max-w-xs">
              <h3 className="font-semibold mb-2">节点信息</h3>
              <p className="text-sm text-gray-600 mb-2">{selectedNode.data.label}</p>
              {selectedNode.data.entity && (
                <Button 
                  size="sm" 
                  onClick={() => onNodeClick(null as any, selectedNode)}
                >
                  查看详情
                </Button>
              )}
            </Panel>
          )}
        </ReactFlow>
      </div>
    </div>
  );
};

export default GraphView;