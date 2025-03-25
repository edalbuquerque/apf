import React, { useState } from 'react';
import { Calculator, Database, FileInput, FileOutput, Table, Settings, FolderOpen, Plus, Download } from 'lucide-react';

type FunctionType = 'ALI' | 'AIE' | 'EE' | 'CE' | 'SE';
type Complexity = 'baixa' | 'media' | 'alta';

interface FunctionPoint {
  type: FunctionType;
  name: string;
  complexity: Complexity;
  value: number;
  projectId: string;
}

interface Project {
  id: string;
  name: string;
}

interface VAFCharacteristic {
  name: string;
  value: number;
}

const complexityValues = {
  ALI: { baixa: 7, media: 10, alta: 15 },
  AIE: { baixa: 5, media: 7, alta: 10 },
  EE: { baixa: 3, media: 4, alta: 6 },
  CE: { baixa: 3, media: 4, alta: 6 },
  SE: { baixa: 4, media: 5, alta: 7 },
};

const initialProjects: Project[] = [
  { id: '1', name: 'Sistema de Vendas' },
  { id: '2', name: 'Portal do Cliente' },
];

const initialPoints: FunctionPoint[] = [
  { type: 'ALI', name: 'Tabela de Clientes', complexity: 'media', value: 10, projectId: '1' },
  { type: 'AIE', name: 'Integração com API Externa', complexity: 'alta', value: 10, projectId: '1' },
  { type: 'EE', name: 'Cadastro de Produto', complexity: 'baixa', value: 3, projectId: '1' },
  { type: 'CE', name: 'Relatório de Vendas', complexity: 'alta', value: 6, projectId: '2' },
  { type: 'SE', name: 'Consulta de Estoque', complexity: 'media', value: 5, projectId: '2' },
];

const initialVAFCharacteristics: VAFCharacteristic[] = [
  { name: 'Comunicação de Dados', value: 3 },
  { name: 'Processamento Distribuído', value: 2 },
  { name: 'Performance', value: 1 },
  { name: 'Configuração Altamente Utilizada', value: 1 },
  { name: 'Volume de Transações', value: 2 },
  { name: 'Entrada de Dados Online', value: 3 },
  { name: 'Eficiência do Usuário Final', value: 2 },
  { name: 'Atualização Online', value: 2 },
  { name: 'Processamento Complexo', value: 1 },
  { name: 'Reusabilidade', value: 2 },
  { name: 'Facilidade de Instalação', value: 1 },
  { name: 'Facilidade de Operação', value: 2 },
  { name: 'Múltiplos Locais', value: 1 },
  { name: 'Facilidade de Mudanças', value: 2 },
];

function App() {
  const [functionPoints, setFunctionPoints] = useState<FunctionPoint[]>(initialPoints);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<string>(projects[0].id);
  const [vafCharacteristics, setVAFCharacteristics] = useState<VAFCharacteristic[]>(initialVAFCharacteristics);
  const [newPoint, setNewPoint] = useState<Partial<FunctionPoint>>({
    type: 'ALI',
    complexity: 'baixa',
    name: '',
    projectId: selectedProject,
  });
  const [newProjectName, setNewProjectName] = useState('');
  const [showNewProject, setShowNewProject] = useState(false);

  const calculateVAF = () => {
    const totalDI = vafCharacteristics.reduce((sum, char) => sum + char.value, 0);
    return (totalDI * 0.01) + 0.65;
  };

  const calculateProjectTotal = (projectId: string) => {
    const projectPoints = functionPoints.filter(point => point.projectId === projectId);
    const rawTotal = projectPoints.reduce((acc, point) => acc + point.value, 0);
    const vaf = calculateVAF();
    return {
      raw: rawTotal,
      adjusted: Math.round(rawTotal * vaf * 100) / 100
    };
  };

  const handleAdd = () => {
    if (!newPoint.name || !newPoint.type || !newPoint.complexity) return;

    const value = complexityValues[newPoint.type][newPoint.complexity];
    const point: FunctionPoint = {
      type: newPoint.type,
      name: newPoint.name,
      complexity: newPoint.complexity,
      value,
      projectId: selectedProject,
    };

    setFunctionPoints([...functionPoints, point]);
    setNewPoint({ type: 'ALI', complexity: 'baixa', name: '', projectId: selectedProject });
  };

  const handleVAFChange = (index: number, newValue: number) => {
    const newCharacteristics = [...vafCharacteristics];
    newCharacteristics[index] = { ...newCharacteristics[index], value: Math.min(5, Math.max(0, newValue)) };
    setVAFCharacteristics(newCharacteristics);
  };

  const handleAddProject = () => {
    if (!newProjectName.trim()) return;
    
    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName.trim()
    };
    
    setProjects([...projects, newProject]);
    setNewProjectName('');
    setShowNewProject(false);
    setSelectedProject(newProject.id);
  };

  const exportToCSV = () => {
    const headers = ['Projeto', 'Tipo', 'Nome', 'Complexidade', 'Pontos'];
    const rows = functionPoints.map(point => [
      projects.find(p => p.id === point.projectId)?.name || '',
      point.type,
      point.name,
      point.complexity,
      point.value
    ]);

    // Adicionar totais por projeto
    rows.push([]);
    projects.forEach(project => {
      const totals = calculateProjectTotal(project.id);
      rows.push([
        `${project.name} - Total Não Ajustado`,
        '',
        '',
        '',
        totals.raw
      ]);
      rows.push([
        `${project.name} - Total Ajustado (VAF: ${calculateVAF().toFixed(2)})`,
        '',
        '',
        '',
        totals.adjusted
      ]);
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'pontos-de-funcao.csv';
    link.click();
  };

  const getTypeIcon = (type: FunctionType) => {
    switch (type) {
      case 'ALI':
        return <Database className="w-5 h-5" />;
      case 'AIE':
        return <Table className="w-5 h-5" />;
      case 'EE':
        return <FileInput className="w-5 h-5" />;
      case 'CE':
        return <FileOutput className="w-5 h-5" />;
      case 'SE':
        return <Calculator className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Análise de Pontos de Função
          </h1>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Exportar CSV
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <FolderOpen className="w-6 h-6" />
                <select
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowNewProject(true)}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Novo Projeto
                </button>
              </div>

              {showNewProject && (
                <div className="mb-6 p-4 border rounded-md bg-gray-50">
                  <h3 className="text-lg font-medium mb-3">Novo Projeto</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nome do projeto"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleAddProject}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Adicionar
                    </button>
                    <button
                      onClick={() => setShowNewProject(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              <h2 className="text-xl font-semibold mb-4">Adicionar Novo Ponto de Função</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newPoint.type}
                  onChange={(e) => setNewPoint({ ...newPoint, type: e.target.value as FunctionType })}
                >
                  <option value="ALI">ALI - Arquivo Lógico Interno</option>
                  <option value="AIE">AIE - Arquivo de Interface Externa</option>
                  <option value="EE">EE - Entrada Externa</option>
                  <option value="CE">CE - Consulta Externa</option>
                  <option value="SE">SE - Saída Externa</option>
                </select>

                <select
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newPoint.complexity}
                  onChange={(e) => setNewPoint({ ...newPoint, complexity: e.target.value as Complexity })}
                >
                  <option value="baixa">Complexidade Baixa</option>
                  <option value="media">Complexidade Média</option>
                  <option value="alta">Complexidade Alta</option>
                </select>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nome da função"
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={newPoint.name}
                    onChange={(e) => setNewPoint({ ...newPoint, name: e.target.value })}
                  />
                  <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Complexidade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pontos
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {functionPoints
                    .filter(point => point.projectId === selectedProject)
                    .map((point, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getTypeIcon(point.type)}
                          <span className="ml-2">{point.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{point.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap capitalize">{point.complexity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{point.value}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-right font-medium">
                      Total de Pontos de Função (Não Ajustado):
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold">
                      {calculateProjectTotal(selectedProject).raw}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-right font-medium">
                      Total de Pontos de Função Ajustado:
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold">
                      {calculateProjectTotal(selectedProject).adjusted}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Fatores de Ajuste</h2>
            </div>
            <div className="space-y-4">
              {vafCharacteristics.map((char, index) => (
                <div key={index} className="flex items-center justify-between">
                  <label className="text-sm text-gray-600">{char.name}</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={char.value}
                    onChange={(e) => handleVAFChange(index, parseInt(e.target.value))}
                    className="w-16 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center font-medium">
                  <span>Fator de Ajuste (VAF):</span>
                  <span>{calculateVAF().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;