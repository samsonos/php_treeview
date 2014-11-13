<?php
/**
 * Created by PhpStorm.
 * User: onysko
 * Date: 10.11.2014
 * Time: 18:33
 */

namespace samson\treeview;


class SamsonTree
{
    public $treeTemplate;

    public $recursion;

    public $controller;

    public function __construct($treeTemplate = 'tree/template', $recursion = 1, $asyncController = '')
    {
        $this->treeTemplate = $treeTemplate;
        $this->recursion = $recursion;
        $this->controller = $asyncController;
    }

    /**
     * @param \samson\cms\Navigation $parent
     * @param string $html
     * @param int $level
     * @param int $currentNavID
     * @return string
     */
    public function htmlTree(\samson\cms\Navigation & $parent = null, & $html = '', $level = 0, $currentNavID = 0)
    {
        /** Collection of visited structures to avoid recursion */
        static $visited = array();

        // If we have not visited this structure yet
        if (!isset($visited[$parent->id])) {
            // Store it as visited
            $visited[$parent->id] = $parent->Name;

            // Get structure children
            $children = $parent->children();

            // If we have children collection for this node
            if (sizeof($children)) {
                // Start html list
                $html .= '<ul>';

                // Iterate all children
                foreach ($children as $child) {
                    if ($child->Active == 1) {
                        // If external view is set
                        if (isset($this->treeTemplate)) {
                            if (!$this->recursion && sizeof($child->children())) {
                                // Start HTML list item and render this view
                                $html .= '<li class="hasChildren" controller = "'.$this->controller.'">';
                            } else {
                                $html .= '<li>';
                            }
                            // Start HTML list item and render this view
                            $html .= m()->view($this->treeTemplate)
                                ->parentid($parent->id)
                                ->nav_id($currentNavID)
                                ->db_structure($child)
                                ->output();
                        } else {
                            // Render just structure name
                            $html .= '<li>' . $child->Name;
                        }

                        if ($this->recursion) {
                            // Go deeper in recursion
                            $this->htmlTree($child, $html, $level++, $currentNavID);
                        }

                        // Close HTML list item
                        $html .= '</li>';
                    }
                }

                // Close HTML list
                $html .= '</ul>';
            }
        }

        return $html;
    }
}
