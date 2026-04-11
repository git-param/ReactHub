import os
import json
import re
from pathlib import Path
from typing import Optional, List
from uuid import uuid4
from app.models.component import Component
from app.utils.constants import COMPONENT_STATUS_PUBLISHED

# Frontend component code directory
FRONTEND_PATH = Path(__file__).parent.parent.parent.parent / "frontend" / "src" / "componentCode"


class ComponentService:
    """Service for managing component file creation and management."""

    @staticmethod
    def _extract_local_css_imports(component_code: str) -> List[str]:
        """
        Extract local CSS imports from component code, e.g.:
        import './Balatro.css'
        import "./styles/Foo.css"
        Returns safe file names to create in component folder.
        """
        pattern = r"import\s+[\"'](\./[^\"']+\.css)[\"']"
        matches = re.findall(pattern, component_code)

        css_files: List[str] = []
        for rel_path in matches:
            filename = Path(rel_path).name
            if filename and filename.endswith(".css") and filename not in css_files:
                css_files.append(filename)

        return css_files
    
    @staticmethod
    def create_component_folder(category: str, component_name: str) -> tuple[str, str]:
        """
        Create a component folder in frontend/componentCode/{category}/{uuid}/
        Returns: (uuid, folder_path)
        """
        component_uuid = str(uuid4()).replace("-", "")[:16]  # 16-char hex ID
        
        category_folder = FRONTEND_PATH / category
        component_folder = category_folder / component_uuid
        
        # Create directories
        component_folder.mkdir(parents=True, exist_ok=True)
        
        return component_uuid, str(component_folder)
    
    @staticmethod
    def create_component_files(
        folder_path: str,
        component_name: str,
        component_code: str,
        css_code: str
    ) -> bool:
        """
        Create Component.tsx and Component.css files in the component folder.
        Returns: True if successful, False otherwise
        """
        try:
            component_path = Path(folder_path)
            
            # Create Component.tsx
            tsx_file = component_path / "Component.tsx"
            tsx_file.write_text(component_code, encoding="utf-8")
            
            # Create Component.css
            css_file = component_path / "Component.css"
            css_file.write_text(css_code, encoding="utf-8")

            # Create alias CSS files if component imports custom css names
            # (e.g., import './Balatro.css')
            for css_filename in ComponentService._extract_local_css_imports(component_code):
                alias_css_file = component_path / css_filename
                if css_filename != "Component.css" and not alias_css_file.exists():
                    alias_css_file.write_text(css_code, encoding="utf-8")
            
            # Create metadata.json
            metadata = {
                "name": component_name,
                "created_at": str(Path(__file__).stat().st_ctime),
            }
            metadata_file = component_path / "metadata.json"
            metadata_file.write_text(json.dumps(metadata, indent=2), encoding="utf-8")
            
            return True
        except Exception as e:
            print(f"Error creating component files: {e}")
            return False
    
    @staticmethod
    def read_component_file(category: str, uuid: str, filename: str) -> Optional[str]:
        """
        Read a component file (Component.tsx or Component.css).
        Returns: File content or None if not found
        """
        try:
            file_path = FRONTEND_PATH / category / uuid / filename
            if file_path.exists():
                return file_path.read_text(encoding="utf-8")

            # Backward compatibility for components that import a custom CSS file
            # name (e.g., Balatro.css) and don't have Component.css.
            if filename == "Component.css":
                folder_path = FRONTEND_PATH / category / uuid
                if folder_path.exists():
                    css_files = sorted(folder_path.glob("*.css"))
                    if css_files:
                        return css_files[0].read_text(encoding="utf-8")
            return None
        except Exception as e:
            print(f"Error reading component file: {e}")
            return None
    
    @staticmethod
    def update_component_files(
        category: str,
        uuid: str,
        component_code: Optional[str] = None,
        css_code: Optional[str] = None
    ) -> bool:
        """
        Update Component.tsx and/or Component.css files.
        Returns: True if successful, False otherwise
        """
        try:
            component_path = FRONTEND_PATH / category / uuid
            
            if component_code:
                tsx_file = component_path / "Component.tsx"
                tsx_file.write_text(component_code, encoding="utf-8")
            
            if css_code:
                css_file = component_path / "Component.css"
                css_file.write_text(css_code, encoding="utf-8")

                # Keep custom imported CSS aliases in sync with updated css code
                source_code = component_code
                if source_code is None:
                    tsx_file = component_path / "Component.tsx"
                    source_code = tsx_file.read_text(encoding="utf-8") if tsx_file.exists() else ""

                for css_filename in ComponentService._extract_local_css_imports(source_code):
                    alias_css_file = component_path / css_filename
                    if css_filename != "Component.css":
                        alias_css_file.write_text(css_code, encoding="utf-8")
            
            return True
        except Exception as e:
            print(f"Error updating component files: {e}")
            return False
    
    @staticmethod
    def delete_component_folder(category: str, uuid: str) -> bool:
        """
        Delete a component folder.
        Returns: True if successful, False otherwise
        """
        try:
            import shutil
            component_path = FRONTEND_PATH / category / uuid
            if component_path.exists():
                shutil.rmtree(component_path)
                return True
            return False
        except Exception as e:
            print(f"Error deleting component folder: {e}")
            return False
    
    @staticmethod
    def scan_components_from_filesystem() -> List[dict]:
        """
        Scan the componentCode directory and load all components.
        Returns: List of component dictionaries with metadata
        """
        components = []
        
        try:
            if not FRONTEND_PATH.exists():
                return components
            
            # Iterate through all category folders
            for category_folder in FRONTEND_PATH.iterdir():
                if not category_folder.is_dir():
                    continue
                
                category_name = category_folder.name
                
                # Iterate through all component UUIDs in the category
                for component_folder in category_folder.iterdir():
                    if not component_folder.is_dir():
                        continue
                    
                    component_uuid = component_folder.name
                    
                    try:
                        # Read Component.tsx
                        tsx_file = component_folder / "Component.tsx"
                        component_code = tsx_file.read_text(encoding="utf-8") if tsx_file.exists() else ""
                        
                        # Read Component.css
                        css_file = component_folder / "Component.css"
                        css_code = css_file.read_text(encoding="utf-8") if css_file.exists() else ""
                        
                        # Read metadata.json
                        metadata_file = component_folder / "metadata.json"
                        metadata = {}
                        if metadata_file.exists():
                            import json
                            metadata = json.loads(metadata_file.read_text(encoding="utf-8"))
                        
                        component = {
                            "id": f"{category_name}-{component_uuid}",
                            "name": metadata.get("name", component_uuid),
                            "category": category_name,
                            "component_code_path": component_uuid,
                            "component_code": component_code,
                            "css_code": css_code,
                            "slug": metadata.get("name", "").lower().replace(" ", "-"),
                            "description": metadata.get("description", ""),
                            "status": "published",
                        }
                        
                        components.append(component)
                    
                    except Exception as e:
                        print(f"Error loading component {component_uuid}: {e}")
                        continue
        
        except Exception as e:
            print(f"Error scanning components: {e}")
        
        return components

